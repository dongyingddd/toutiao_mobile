// 专门处理频道的请求
import request from '@/utils/request'
import store from '@/store'
/**
 * 获取我的频道
 */
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key
export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读取用户频道数据
    const str = localStorage.getItem(key)
    if (str) {
      // 缓存中有数据,应该把本地数据释放给后面的执行结果
      resolve({ channels: JSON.parse(str) })
    } else {
      // 如果缓存中没有数据,就要去线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取请求结果,放入缓存
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要resolve我们的数据
        resolve(result)
      })
    }
  })
}
/**
 * 获取全部频道
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
