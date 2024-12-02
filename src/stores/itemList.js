import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useItemStore = defineStore(
  'itemList',
  () => {
    const scrollTop = ref(0)
    const saveScrollTop = t => {
      scrollTop.value = t
    }

    const currentPage = ref(0)
    const saveCurrentPage = t => {
      currentPage.value = t
    }

    const notes = ref([])
    const appendNotes = newItems => {
      // 去重：只添加没有存在过的项
      const uniqueItems = newItems.filter(
        newItem =>
          !notes.value.some(existingItem => existingItem.id === newItem.id)
      )
      notes.value = [...notes.value, ...uniqueItems]
    }

    const isFinish = ref(false)
    const saveIsfinish = t => {
      isFinish.value = t
    }

    // 清除仓库数据
    const clearData = () => {
      scrollTop.value = 0
      currentPage.value = 0
      notes.value = []
      isFinish.value = false
    }

    return {
      scrollTop,
      saveScrollTop,
      currentPage,
      saveCurrentPage,
      notes,
      appendNotes,
      isFinish,
      saveIsfinish,
      clearData
    }
  },
  {
    persist: true
  }
)
