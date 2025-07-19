import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCommentList } from '@/api/comment'

export const useCommentListStore = defineStore('commentList', () => {
  const commentList = ref([])
  const setCommentList = (list) => {
    commentList.value = list
  }
  const clearCommentList = () => {
    commentList.value = []
  }
  const setNewCommentList = async (id) => {
    const response = await getCommentList(id)
    commentList.value = response.data.data
  }
  return { commentList, setCommentList, clearCommentList, setNewCommentList }
})
