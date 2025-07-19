import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userId = userStore.userId

export const getCommentList = async (id) => {
  try {
    const response = await request.get('/comment/list', {
      params: {
        articleId: id
      }
    })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
  }
}

export const createComment = async (id, content) => {
  try {
    console.log(typeof id)
    const response = await request.post('/comment/create', {
      articleId: id,
      content: content,
      userId: userId
    })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
  }
}