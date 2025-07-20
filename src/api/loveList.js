import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userId = userStore.userId

export const getLoveList = async () => {
  try {
    const response = await request.get('/user/liked', {
      params: {
        userId: userId
      },
      headers: {
        platform: 'H5',
        timeout: 5000
      }
    })
    console.log('dainzan',response.data)
    return response.data // 返回数据部分
  } catch (error) {
    console.error('请求失败:', error)
    throw error // 重新抛出错误，以便调用处处理
  }
}

export const getCollectList = async () => {
  try {
    const response = await request.get('/user/collected', {
      params: {
        userId: userId
      },
      headers: {
        platform: 'H5',
        timeout: 5000
      }
    })
    console.log('shoucang',response.data)
    return response.data // 返回数据部分
  } catch (error) {
    console.error('请求失败:', error)
    throw error // 重新抛出错误，以便调用处处理
  }
}
