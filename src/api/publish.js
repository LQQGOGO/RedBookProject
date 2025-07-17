import request from '@/utils/request'

export const publish = async (data) => {
  try {
    const response = await request.post('/article/publish', data)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}






