<template>
  <div class="container">
      <!-- 放置一个vant导航组件 -->
      <van-nav-bar
        title="黑马头条"
        right-text="搜索"
        v-if="$route.path !== '/user'"
        fixed
        @click-right="$router.push('/search')" >

      </van-nav-bar>
      <!-- 二级路由容器 -->
      <div class="my-wrapper" :class="{noTop: $route.path === '/user'}">
        <router-view/>
      </div>
      <!-- 放置一个标签栏 -->
      <!-- route： 开启路由模式 -->
      <van-tabbar route>
        <van-tabbar-item to="/" icon="wap-home-o">首页</van-tabbar-item>
        <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
        <van-tabbar-item to="/video" icon="tv-o">视频</van-tabbar-item>
        <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .container{
    width: 100%;
    height: 100%;
    position: relative;
    .my-wrapper{
      width: 100%;
      height: 100%;
      overflow: hidden;
      padding-top: 46px;
      padding-bottom: 50px;
      box-sizing: border-box;
      &.noTop{
        padding-top: 0;
      }
    }
}
</style>
