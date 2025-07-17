export const getImageSize = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    //解决跨域
    //img.crossOrigin = 'anonymous'
    console.log('imageUrl', imageUrl)
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('图片无法加载'))
    }
    img.src = imageUrl
  })
}
