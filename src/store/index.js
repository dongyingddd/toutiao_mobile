import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  // 专门存放共享状态
  state: {
    user: auth.getUser // 我们的token信息对象
  },
  // 要修改token,只能通过mutations
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的user数据给sate
      // 更新vuex的时候,也应该将最新的数据 存入本地缓存
      auth.setUser(payload.user) // 相当于保持vuex和本地存储的同步
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      // 缓存数据,也需要更新
      auth.delUser() // 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
