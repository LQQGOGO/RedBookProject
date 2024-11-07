import request from '@/utils/request'

export const codeLogin = async (mobile, smsCode) => {
  try {
    const response = await request.post(
      '/passport/login',
      {
        form: {
          isParty: false,
          mobile: mobile,
          partyData: {},
          smsCode: smsCode
        }
      },
      {
        headers: {
          platform: 'H5'
        }
      }
    )

    return response // 确保返回响应
  } catch (error) {
    console.error('请求失败:', error)


    throw error // 重新抛出错误以便在调用处捕获
  }
}
