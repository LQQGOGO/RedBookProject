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
      notes.value = [...notes.value, ...newItems]
    }

    const isFinish = ref(false)
    const saveIsfinish = t => {
      isFinish.value = t
    }
    return {
      scrollTop,
      saveScrollTop,
      currentPage,
      saveCurrentPage,
      notes,
      appendNotes,
      isFinish,
      saveIsfinish
    }
  },
  {
    persist: true
  }
)
