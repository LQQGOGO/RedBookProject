import request from '@/utils/request'

export const getItemList = async () => {
  try {
    const response = await request.get('/item/item_list', {
      headers: {
        platform: 'H5',
        timeout: 5000
      }
    })
    return response // 确保返回响应
  } catch (error) {
    console.error('请求失败:', error)

    throw error // 重新抛出错误以便在调用处捕获
  }
}
