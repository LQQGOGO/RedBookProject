// hash-worker.js
/* eslint-env worker */
/* global importScripts, SparkMD5 */
// importScripts('/spark-md5.min.js') // 需要引入 SparkMD5
importScripts('spark-md5.min.js')

self.onmessage = function (e) {
  // self.postMessage('创建worker')
  const { file, chunkSize } = e.data
  const spark = new SparkMD5.ArrayBuffer()
  const totalChunks = Math.ceil(file.size / chunkSize)
  let processedChunks = 0

  function processChunk(index) {
    const reader = new FileReader()
    const start = index * chunkSize
    const end = Math.min(start + chunkSize, file.size)

    reader.onload = function (e) {
      spark.append(e.target.result)
      processedChunks++

      // 发送进度
      self.postMessage({
        type: 'progress',
        progress: (processedChunks / totalChunks) * 100
      })

      if (processedChunks < totalChunks) {
        processChunk(processedChunks)
      } else {
        // 计算完成，发送哈希值
        self.postMessage({
          type: 'hash',
          hash: spark.end()
        })
      }
    }

    reader.onerror = function (error) {
      console.error('Worker 错误:', error.message)
      self.postMessage({
        type: 'error',
        error: error.message
      })
    }

    reader.readAsArrayBuffer(file.slice(start, end))
  }

  // 开始处理第一个块
  processChunk(0)
}
