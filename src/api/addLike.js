import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

// 添加点赞
export const addLike = async (id) => {
  try {
    const userStore = useUserStore()
    const response = await request.post(
      '/article/like',
      {
        id: id,
        userId: userStore.userId
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    return response
  } catch (error) {
    console.error('点赞失败:', error)

    throw error
  }
}

// 取消点赞
export const removeLike = async (id) => {
  try {
    const userStore = useUserStore()
    const response = await request.post(
      '/article/cancel_like',
      {
        id: id,
        userId: userStore.userId
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    return response
  } catch (error) {
    console.error('取消点赞失败:', error)

    throw error
  }
}

//添加收藏
export const addCollect = async (id) => {
  try {
    const userStore = useUserStore()
    const response = await request.post(
      '/article/collect',
      {
        id: id,
        userId: userStore.userId
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    return response
  } catch (error) {
    console.error('添加收藏失败:', error)

    throw error
  }
}

//取消收藏
export const removeCollect = async (id) => {
  try {
    const userStore = useUserStore()
    const response = await request.post(
      '/article/cancel_collect',
      {
        id: id,
        userId: userStore.userId
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    return response
  } catch (error) {
    console.error('取消收藏失败:', error)

    throw error
  }
}
