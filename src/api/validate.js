import request from '@/utils/request'

export const validateToken = async (token) => {
  const res = await request.get('/auth/validate', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // console.log(res)
  return res.data
}
