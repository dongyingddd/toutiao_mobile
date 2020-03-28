/****
 *request.js  请求管理工具
 *
 * *****/
import axios from 'axios'
import JSONBig from 'json-bigint'
// 引入vuex中的store实例对象,相当于组件中的 this.$store
import store from '@/store'
import router from '@/router'

// axios.defaults 是对原有默认值进行修改,即对本身axios进行修改
// 创建一个新的axios实例,和原来的axios没有关系了
const instance = axios.create({
  // 构造参数 传入一些配置和defaults一样
  // 设置baseUrl 和处理大数字
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础的请求地址
  // 此函数是后台响应回来 但还没进入到dataaxios的响应拦截器时执行 数组里可以写多个处理函数
  transformResponse: [function (data) {
    // data就是后端响应回来的字符串
    return data ? JSONBig.parse(data) : {}
  }]
})

// token的注入 应该是在请求之前 也就是请求拦截器
instance.interceptors.request.use(function (config) {
  // debugger
  // 成功的时候
  if (store.state.user.token) {
    // 将token统一注入到headers中
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    // 返回配置
  }
  return config
}, function (error) {
  // 直接返回Promise的错误
  return Promise.reject(error) // 返回错误 这样的话会直接进入到axios的catch中
})

// axios默认给我们的数据加了一层data,需要解构
instance.interceptors.response.use(function (response) {
  try {
    return response.data.data // 如果成功 解开两层
  } catch (error) {
    return response.data // 如果失败 解开一层
  }
}, async function (error) {
  // 如果请求失败或者token失效或者其他错误 会进入到响应拦截器的错误区域
  // 只要是401就是token失效(导航守卫会将没有token的请求拦截在外面)
  /****
   *error
   *  config: 是出现这次错误请求的配置信息
   *  request: 请求对象
   *  response:响应对象 status 状态码
   * *** */
  if (error.response && error.response.status === 401) {
    // 如果状态码是401的话就认为是token失效了 就需要处理token失效问题
    // refresh_token 相当于一个续命的药

    /***
     *  path : 跳转登陆 跳转登陆页面 需要携带当前访问的路由地址, 在登陆成功之后,需要根据地址回跳
     */
    const path = {
      path: '/login',
      redirectUrl: router.currentRoute.fullPath
    }

    if (store.state.user.refresh_token) {
      try {
        // 如果有refresh_token ,就需要用他来换取新的token 需要调用刷新token的接口
        // 这里必须用axios 因为token已经失效了 如果用instance拦截器还是会将失效的token注入到headers中,会造成死循环
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // await 后面是Promise成功执行完成的逻辑
        // 如果成功了,应该更新失效的token
        // 直接更新vuex中的数据
        // 提交mutations更新vuex数据
        store.commit('updataUser', {
          // 载荷数据
          user: {
            token: result.data.data.token, // 最新的token
            refresh_token: store.sate.user.refresh_token // 还是原来的refresh_token 14天后过期
          }
        })
        // 需要把之前错误的请求再次发出去
        return instance(error.config)
      } catch (error) {
        // 代码执行进入这里,说明尝试续命,但是续命失败
        // 在登陆之前 ,需要删掉token ,因为此时的token失效,refresh_token也失效
        store.commit('delUser')
        // 跳转登陆页面
        router.push(path)
      }
    } else {
      // 如果没有refresh_token 直接宣布over 直接跳到登录页面
      // router.push('/login') //直接跳到登录页面无可厚非, 但是我们需要做一种更复杂的场景
      // 如果由于token失效,跳到登录页,那当前页面怎么办呢 ? 应该在登陆成功后再跳回来
      store.commit('delUser') // 在登陆前,也要删除token,因为token失效了
      router.push(path)
    }
  }
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的catch
})
export default instance
