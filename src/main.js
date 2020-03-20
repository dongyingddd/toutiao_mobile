import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
// import 'vant/lib/index.css'
import 'vant/lib/index.less'
import 'amfe-flexible' // 修改rem基准值的js插件
import '@/styles/index.less' // 引入全局自定义样式 覆盖vant的样式
import '@/permission' // 引入导航守卫
import '@/utils/request' // 引入封装后的请求管理工具request
Vue.use(vant)
Vue.config.productionTip = false
// 全局注册 实际上调用了vant到处的对象的install方法
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
