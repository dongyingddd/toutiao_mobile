<template>
  <!-- 文章列表组件 放置列表-->
  <!-- van-list 可以帮我们实现上拉加载 需要一些变量 -->
  <!-- 这里放置这个div的目的时 形成滚动条 因为我们后期要做阅读记忆 -->
  <!-- 阅读记忆: 上次你阅读到哪 回来之后还是哪 -->
  <div class="scroll-wrapper">
      <!-- 文章列表 -->
      <!-- van-list组件 如果不加干涉,初始化完毕后,就会检测自己距离底部的长度,如果超过了限定,就会执行load事件 自动把绑定的loadind变为true -->
      <van-list v-model="upLoading" :finished="finished" @load="onload">

      </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 表示是否开启了上拉加载
      finished: false // 表示是否已经完成所有数据的加载
    }
  },
  methods: {
    onload () {
      console.log('开始加载数据')
      // 如果你有数据,应该把数据加到list中

      // 如果你想关掉
      setTimeout(() => {
        this.finished = true // 表示数据已经加载完毕了 没有数据了
      }, 1000)
    }
  }
}
</script>

<style>

</style>
