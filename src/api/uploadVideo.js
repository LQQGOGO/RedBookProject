import request from '@/utils/request'

//预设切片大小 1MB
const chunkSize = 1024 * 1024 * 1

//文件切片
const createChunks = (file, chunkSize) => {
  //接收一个文件对象，把文件对象切片，返回切片数组
  const chunks = []
  let index = 0
  for (let i = 0; i < file.size; i += chunkSize) {
    chunks.push({
      file: file.slice(i, i + chunkSize),
      name: `${file.name}_${index}`,
      chunkIndex: index,
      uploaded: false,
    })
    index++
  }
  return chunks
}

const uploadVideo = async formData => {
  // console.log('formData', formData)
  try {
    // const chunks = createChunks(formData, chunkSize)
    // console.log('chunks', chunks)
    const response = await request.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    console.error('视频上传失败:', error)
    throw error
  }
}

export { uploadVideo }
