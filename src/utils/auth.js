/********
 * auth.js 专门处理token的读写的删除
 * create by dy 2020/3/15
 *
 * ******** */
const USER_TOKEN = 'toutiao-mobile'

// 设置用户的token信息
export function setUser (user) {
  // user应该是一个对象
  // 对象需要转化成字符串
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户的token信息
export function getUser () {
  // 短路表达式
  // 如果前面为true,后面不执行，前面为false，后面才执行
  // 将字符串转化成对象再返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}

// 删除用户的token信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN) // 删除token
}
