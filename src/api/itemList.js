import request from '@/utils/request'

export const getItemList = async (page = 1, pageSize = 20, channel = 'recommend') => {
  try {
    const response = await request.get('/item/item_list', {
      params: {
        // 传递分页参数
        page,
        pageSize,
        channel,
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
