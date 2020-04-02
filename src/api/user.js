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
/**
 * 关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

/**
 * 取消关注用户
 */
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
