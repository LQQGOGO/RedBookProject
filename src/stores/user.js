import { defineStore } from "pinia";
import { ref } from 'vue'
// import { validateToken } from '@/api/validate'

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
    const clearToken = () => {
      token.value = ''
    }

    return { userId, token, setToken, setUserId, clearToken}
  },
  {
    persist: true
  }
)
