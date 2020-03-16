<template>
    <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='登录'  left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 登陆布局 -->
    <van-cell-group>
      <van-field label="手机号" placeholder="请输入手机号"></van-field>
      <van-field label="验证码" placeholder="请输入验证码">
        <van-button slot="button" type="primary" size="small">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
     <div class="login-box">
        <van-button type="info" block round size="small">登录</van-button>
     </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .login-box{
    padding: 20px;
  }
</style>
