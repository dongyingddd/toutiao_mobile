/******
 * 处理文章模块的请求数据
 *
 * ****/
import request from '@/utils/request'
/***
 *
 *获取文章推荐数据
  需要传入timestamp 时间戳 channel_id 频道id
 */
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
  })
}

/**
 *
 * 对文章不感兴趣
 */
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
