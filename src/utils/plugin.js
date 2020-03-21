/****
 * plugin.js
 * 专门用来放置一些有用的小函数以及一些过滤器方法
 *
 *
 ****/
// 导出一个默认对象
export default {
  // 该方法会在Vue.use时调用
  install (Vue) {
    // 执行此行代码时 Vue.prototype.$notify应该已经挂在完成
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify(
      {
        duration: 800,
        ...params
      })
    // 给Vue的原型属性赋值一个函数 自定义一个函数名 所有组件都有了这个属性
    Vue.prototype.$sleep = sleep
  }
}
// 休眠函数
// time = 500 如果传了time 用你的 如果没传 用默认的500
function sleep (time = 500) {
  // 返回一个Promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但有一个延迟
    setTimeout(() => {
      resolve()
    }, time)
  })
}
