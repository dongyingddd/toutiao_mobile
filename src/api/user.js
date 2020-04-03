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

/**
 * 获取用户自己的个人信息
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}

/**
 * 获取用户个人资料
 */
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

/**
 * 上传头像
 */
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'PATCH',
    data
  })
}

/**
 * 保存用户信息
 */
export function saveUser (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null } // 直接将photo设置为空
  })
}
