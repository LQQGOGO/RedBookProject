import request from '@/utils/request'

export const uploadImage = async (formData) => {
  try {
    const response = await request.post('/upload/image', formData)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}
