import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userId = ref('')
    const token = ref('')
    const setToken = (t) =>  {
      token.value = t
    }
    const setUserId = (u) => {
      userId.value = u
    }
    return { userId, token, setToken, setUserId }
  },
  {
    persist: true
  }
)
