/****
 *request.js  请求管理工具
 *
 * *****/
import axios from 'axios'
import JSONBig from 'json-bigint'
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
export default instance
