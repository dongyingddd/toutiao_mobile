import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css'
Vue.config.productionTip = false
Vue.use(vant) // 全局注册 实际上调用了vant到处的对象的install方法
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
