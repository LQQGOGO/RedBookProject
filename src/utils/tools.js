export function rafThrottle(fn) {
  let lock = false
  return function (...args) {
    if (lock) return // 如果已经被锁定，则直接返回
    lock = true // 锁定，防止多次调用
    window.requestAnimationFrame(() => {
      fn(...args) // 执行传入的函数
      lock = false // 解除锁定
    })
  }
}

export function debounce(fn, delay = 200) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer) // 清除之前的定时器
    timer = setTimeout(() => {
      fn(...args) // 延时执行传入的函数
    }, delay)
  }
}
