/********
 *  登录方法
 *
 * ******/
import request from '../utils/request'
export function login (data) {
  // 返回一个Promise对象
  return request({
    // 配置选项
    url: '/authorizations',
    method: 'post',
    data
  })
}
