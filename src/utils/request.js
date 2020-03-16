/****
 *request.js  请求管理工具
 *
 * *****/
import axios from 'axios'
import JSONBig from 'json-bigint'
// 引入vuex中的store实例对象,相当于组件中的 this.$store
import store from '@/store'
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
  // 成功的时候
  if (store.state.user.token) {
    // 将token统一注入到headers中
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    // 返回配置
    return config
  }
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
}, function (error) {
  // 返回执行链的catch
  return Promise.reject(error)
})
export default instance
