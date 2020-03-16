/*******
 * 在此文件中做导航首位
 *
 * ********/
import router from '@/router' // 引入路由实例
import store from '@/store'
// 前置首位
// 每当路由发生变化时,前置首位都会执行
router.beforeEach(function (to, from, next) {
  // 如果地址 /user开头,检查是否登陆,如果没有 重定向到登陆页面
  // 需要判断你的地址 和你的token
  // 如果是 /user起始, 说明需要进行token的判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 地址是/user起始,并且token不存在
    next({
      path: '/login', // 要跳转的地址
      // fullPath 和path的区别是 fullPath会带?后面的参数 是一个完整的路径
      redirectUrl: to.fullPath // 告诉登录页 我没有完成访问 你登陆之后一定要帮我完成
    })
  } else {
    // 程序执行,进入这里 说明 地址不是/user 或者 是/user起始 并且token存在
    next()
  }
})
