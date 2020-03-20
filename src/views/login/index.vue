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
    // 登录校验
    login () {
      // 校验手机号和验证码
      const validateMobile = this.checkMobile
      const vilidateCode = this.checkCode
      if (validateMobile && vilidateCode) {
        // 如果两个检查都是true,就表示通过了校验
        console.log('校验通过')
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
