import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入一级路由组件
const Layout = () => import('@/views/layout') // 布局组件
// 导入二级路由组件
const Home = () => import('@/views/home') // 首页
const Question = () => import('@/views/question') // 问答
const Video = () => import('@/views/video') // 视频
const User = () => import('@/views/user') // 登陆组件

// 以及路由组件
const Chat = () => import('@/views/user/chat') // 小智同学组件
const Profile = () => import('@/views/user/profile') // 编辑个人资料组件
const Login = () => import('@/views/login') // 个人中心
const Search = () => import('@/views/search') // 搜索模块
const SearchResult = () => import('@/views/search/result') // 搜索结构模块
const Article = () => import('@/views/article') // 文章详情模块

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: Home
      }, {
        path: '/question',
        component: Question
      }, {
        path: '/video',
        component: Video
      }, {
        path: '/user',
        component: User
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/user/chat',
    component: Chat
  }, {
    path: '/user/profile',
    component: Profile
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/search/result',
    component: SearchResult
  }, {
    path: '/article',
    component: Article
  }

]

const router = new VueRouter({
  routes
})

export default router
