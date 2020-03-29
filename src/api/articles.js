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

/*****
 *
 * 举报文章接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

/*****
 * 获取联想搜索建议API
 *
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params // query参数放置在params中
  })
}

/****
 * 搜索文章API
 *
 */
export function searchArticle (params) {
  return request({
    url: '/search',
    params // 关键词 及分页信息
  })
}
/**
 * 获取文章详情的API
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
