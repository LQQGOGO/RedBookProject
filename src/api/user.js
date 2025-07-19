import request from '@/utils/request'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const user_id = userStore.userId

//查询是否点赞文章
export const didLiked = async id => {
  try {
    // console.log(id, user_id)

    const response = await request.get('/article/did_liked', {
      params: {
        id: id,
        userId: user_id
      },
      headers: {
        platform: 'H5'
      }
    })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

//查询是否收藏文章
export const didCollected = async id => {
  try {
    const response = await request.get('/article/did_collected', {
      params: {
        id: id,
        userId: user_id
      },
      headers: {
        platform: 'H5'
      }
    })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

//查询点赞列表
export const getLikedArticles = async user_id => {
  try {
    const response = await request.get(
      '/user/liked',
      {
        params: {
          userId: user_id
        },
        headers: {
          platform: 'H5'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

//查询收藏列表
export const getCollectedArticles = async user_id => {
  try {
    const response = await request.get('/user/collected', {
      params: {
        userId: user_id
      },
      headers: {
        platform: 'H5'
      }
    })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}
