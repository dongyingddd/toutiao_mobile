<template>
    <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='登录'  left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 登陆布局 -->
    <van-cell-group>
      <van-field v-model.trim="loginForm.mobile"
                  @blur="checkMobile"
                  :error-message="errorMessage.mobile"
                  label="手机号"
                  placeholder="请输入手机号">

      </van-field>
      <van-field v-model.trim="loginForm.code"
                  @blur="checkCode"
                  :error-message="errorMessage.code"
                  label="验证码"
                  placeholder="请输入验证码">
        <van-button slot="button" type="primary" size="small">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
     <div class="login-box">
        <van-button type="info" block round size="small" @click="login">登录</van-button>
     </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // 此对象专门放置消息
      errorMessage: {
        mobile: '', // 手机号的错误消息
        code: '' // 验证码的错误消息
      }
    }
  },
  methods: {
    // 定义检查手机号方法
    checkMobile () {
      // 获取手机号 判断是否为空 是否满足手机号格式
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 如果到了这个位置说明校验通过
      this.errorMessage.mobile = ''
      return true
    },
    // 定义校验验证码额方法
    checkCode () {
      if (!this.loginForm.code) {
        this.loginForm.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 可以导入需要的方法, 直接把updateUser方法映射到当前的methods中
    ...mapMutations(['updateUser']),
    // 登录校验
    async login () {
      // 校验手机号和验证码

      const validateMobile = this.checkMobile()
      const vilidateCode = this.checkCode()
      if (validateMobile && vilidateCode) {
        // 如果两个检查都是true,就表示通过了校验
        // console.log('校验通过')
        try {
          const result = await login(this.loginForm)
          // 更新当前的token和refresh_token
          this.updateUser({ user: result })
          // 判断是否有需要跳转的页面,如果有就跳转,如果没有,就跳到主页
          const { redirectUrl } = this.$route.query
          this.$router.push(redirectUrl || '/') // 短路表达式
        } catch (error) {
          // 提示消息 提示用户,告诉用户 登陆失败
          this.$gnotify({ message: '用户名或者验证码错误' })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-box{
    padding: 20px;
  }
</style>
