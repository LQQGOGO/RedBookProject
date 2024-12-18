import request from '@/utils/request'

export const changeLove = async (note_id) => {
  try {
    const response = await request.post(
      '/item/item_like',
      {
        note_id: note_id
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    return response // 确保返回响应
  } catch (error) {
    console.error('请求失败:', error)

    throw error // 重新抛出错误以便在调用处捕获
  }
}
