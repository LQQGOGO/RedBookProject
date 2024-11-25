import request from '@/utils/request'

export const codeRegist = async (username, password) => {
  try {
    const response = await request.post(
      '/api/regist',
      {
        username: username,
        password: password
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )
    console.log(response.data)
    return response // 确保返回响应
  } catch (error) {
    console.error('请求失败:', error)

    throw error // 重新抛出错误以便在调用处捕获
  }
}
