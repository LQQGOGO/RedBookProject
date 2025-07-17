import { useUserStore } from '@/stores/user'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
const baseURL = 'http://localhost:3050'

//配置基地址，超时时间
const instance = axios.create({
  baseURL: baseURL,
  timeout: 100000
})

//在请求头上添加token
instance.interceptors.request.use(
  config => {
    //再发送请求前添加loading效果

    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  err => {

    return Promise.reject(err)
  }
)

//处理业务失败，摘取核心响应数据，处理401错误
instance.interceptors.response.use(
  res => {
    // 移除对 `res.data.code` 的判断，直接返回响应
    if (res.status === 200) {
      return res
    }

    // 如果需要对 code 进行特定处理，可以增加额外条件
    if (res.data.code !== 0) {
      ElMessage({
        message: res.data.message || '服务异常',
        type: 'error'
      })
      return Promise.reject(res.data)
    }

    return res
  },
  err => {
    ElMessage({
      message: err.response?.data.message || '服务异常',
      type: 'error'
    })
    if (err.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)


export default instance
export { baseURL }
