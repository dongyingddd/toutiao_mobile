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

/***
 * 删除频道API
 * id: 作为删除频道的依据
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 直接将本地缓存中的字符串,转化成对象
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1) // 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve() // 如果执行成功了,我们应该resolve
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}

/******
 * 添加频道的API
 * channel : {id: 1,name: 'c++}
 * ***/
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 得到缓存中的数据 转化成数组
    channels.push(channel) // 将添加的频道数据追加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
    resolve() // 执行这一步 相当于告诉我们使用Promise方法执行成功了
  })
}
