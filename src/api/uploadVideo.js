import request from '@/utils/request'
// import SparkMD5 from 'spark-md5'

// 预设切片大小 2MB
const CHUNK_SIZE = 1024 * 1024 * 2
// 最大并发请求数
const MAX_REQUEST = 5
// 最大重试次数
const MAX_RETRIES = 3

//创建切片
const createChunks = file => {
  const chunks = []
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)

    chunks.push({
      file: file.slice(start, end),
      name: `${file.name}_${i}`,
      chunkIndex: i,
      // size: end - start,
      uploaded: false,
      retries: 0
    })
  }

  return chunks
}

//计算文件哈希
const calculateFileHash = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    // console.log('进入计算webwoker');

    // 创建 Web Worker
    const worker = new Worker('/worker/hash-work.js')
    // console.log('创建worker')
    // console.log('worker', worker)

    // 向 Worker 发送文件和配置
    worker.postMessage({ file, chunkSize: CHUNK_SIZE })

    // 接收 Worker 的进度更新
    worker.onmessage = e => {
      if (e.data.type === 'progress') {
        onProgress && onProgress(e.data.progress)
      } else if (e.data.type === 'hash') {
        resolve(e.data.hash)
      }
    }

    // 处理 Worker 错误
    worker.onerror = error => {
      reject(new Error(`计算文件哈希失败: ${error.message}`))
    }
  })
}

//上传单个切片
const uploadChunk = async (chunk, fileHash, fileName) => {
  try {
    const formData = new FormData()
    // formData.append('video', chunk.file)
    // formData.append('fileHash', fileHash)
    // formData.append('fileName', fileName)
    // formData.append('chunkIndex', chunk.chunkIndex)
    // formData.append('totalChunks', chunk.totalChunks)
    //解决multer解析顺序的问题
    const tempFileName = `${fileHash}|${chunk.chunkIndex}|${fileName}`
    // 创建一个新的 File 对象，覆盖原始名
    const tempFile = new File([chunk.file], tempFileName, {
      type: chunk.file.type
    })

    formData.append('video', tempFile)

    const response = await request.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        // 计算并报告当前切片的上传进度
        const chunkProgress = (e.loaded / e.total) * (100 / chunk.totalChunks)
        chunk.progress = chunkProgress
      }
    })

    chunk.uploaded = true
    return response
  } catch (error) {
    chunk.retries++
    console.error(
      `切片 ${chunk.chunkIndex} 上传失败 (尝试 ${chunk.retries}):`,
      error
    )
    throw error
  }
}

//控制并发上传
const uploadChunksWithConcurrency = async (
  chunks,
  fileHash,
  fileName,
  onProgress
) => {
  let processedChunks = 0
  let totalChunks = chunks.length
  let overallProgress = 0

  // 更新整体进度
  const updateOverallProgress = () => {
    const completedChunks = chunks.filter(chunk => chunk.uploaded).length
    overallProgress = (completedChunks / totalChunks) * 100

    // 加上所有正在上传的切片的进度
    const uploadingProgress = chunks
      .filter(chunk => !chunk.uploaded && chunk.progress)
      .reduce((sum, chunk) => sum + chunk.progress, 0)

    onProgress && onProgress(overallProgress + uploadingProgress)
  }

  // 处理单个切片的上传
  const processChunk = async chunk => {
    if (chunk.uploaded) return

    try {
      await uploadChunk(chunk, fileHash, fileName, totalChunks)
      processedChunks++
      console.log(
        `切片 ${chunk.chunkIndex} 上传成功 (${processedChunks}/${totalChunks})`
      )
      updateOverallProgress()
    } catch (error) {
      // 重试机制
      if (chunk.retries < MAX_RETRIES) {
        console.log(`将重试上传切片 ${chunk.chunkIndex}`)
        await new Promise(resolve => setTimeout(resolve, 1000 * chunk.retries))
        await processChunk(chunk)
      } else {
        console.error(`切片 ${chunk.chunkIndex} 达到最大重试次数`)
        throw new Error(`切片 ${chunk.chunkIndex} 上传失败`)
      }
    }
  }

  // 实现并发控制
  let running = 0
  let index = 0

  const worker = async () => {
    while (index < totalChunks) {
      const currentIndex = index++
      const currentChunk = chunks[currentIndex]

      if (!currentChunk.uploaded) {
        //原子操作，避免操作同一个
        running++
        await processChunk(currentChunk).catch(err => console.error(err))
        running--
      }
    }
  }

  // 启动工作线程
  const workers = Array(Math.min(MAX_REQUEST, totalChunks)).fill().map(worker)
  await Promise.allSettled(workers)

  // 检查是否所有切片都上传成功
  const failedChunks = chunks.filter(chunk => !chunk.uploaded)
  if (failedChunks.length > 0) {
    throw new Error(`还有 ${failedChunks.length} 个切片上传失败`)
  }

  return true
}

//查询已上传的切片
const getUploadedChunks = async fileHash => {
  try {
    const response = await request.get('/upload/video/status', {
      params: { fileHash }
    })

    return response.data.uploadedChunks || []
  } catch (error) {
    console.error('检查已上传切片失败:', error)
    return []
  }
}

//合并切片请求
const mergeChunks = async (fileHash, fileName, totalChunks) => {
  try {
    const response = await request.post('/upload/video/merge', {
      fileHash,
      fileName,
      totalChunks
    })

    return response
  } catch (error) {
    console.error('合并切片失败:', error)
    throw error
  }
}

//主上传函数
const uploadVideo = async (formData, onProgress, onHashProgress) => {
  try {
    const file = formData.get('video')
    const fileName = file.name

    // 计算文件哈希
    console.log('开始计算文件哈希...')
    const fileHash = await calculateFileHash(file, progress => {
      onHashProgress && onHashProgress(progress)
    })
    console.log('文件哈希计算完成:', fileHash)

    // 创建切片
    const chunks = createChunks(file)
    const totalChunks = chunks.length
    console.log(`文件已被切分为 ${totalChunks} 个切片`)

    // 检查已上传的切片
    const existingChunks = await getUploadedChunks(fileHash)
    existingChunks.forEach(chunkIndex => {
      if (chunks[chunkIndex]) {
        chunks[chunkIndex].uploaded = true
      }
    })

    const uploadedChunks = chunks.filter(chunk => chunk.uploaded).length
    console.log(`已发现 ${uploadedChunks}/${totalChunks} 个切片已上传`)

    // 更新初始进度
    onProgress && onProgress((uploadedChunks / totalChunks) * 100)

    // 上传未完成的切片
    console.log('开始上传切片...')
    await uploadChunksWithConcurrency(chunks, fileHash, fileName, onProgress)

    // 合并切片
    console.log('所有切片上传完成，请求合并...')
    const mergeResponse = await mergeChunks(fileHash, fileName, totalChunks)

    return mergeResponse.data
  } catch (error) {
    console.error('视频上传过程中发生错误:', error)
    throw error
  }
}

export { uploadVideo }
