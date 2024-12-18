import request from '@/utils/request'

export const getItemDetail = async (
  note_id,
) => {
  try {
    const response = await request.get('/item/item_detail', {
      params: {
        // 传递笔记id
        note_id
      },
      headers: {
        platform: 'H5',
        timeout: 5000
      }
    })
    return response.data // 返回数据部分
  } catch (error) {
    console.error('请求失败:', error)
    throw error // 重新抛出错误，以便调用处处理
  }
}
