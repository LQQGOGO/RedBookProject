import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (t) =>  {
      token.value = t
    }
    return { token, setToken }
  },
  {
    persist: true
  }
)
