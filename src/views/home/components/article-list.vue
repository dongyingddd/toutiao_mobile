<template>
  <!-- 文章列表组件 放置列表-->
  <!-- van-list 可以帮我们实现上拉加载 需要一些变量 -->
  <!-- 这里放置这个div的目的时 形成滚动条 因为我们后期要做阅读记忆 -->
  <!-- 阅读记忆: 上次你阅读到哪 回来之后还是哪 -->
  <div class="scroll-wrapper">
      <!-- 文章列表 -->
      <!-- van-list组件 如果不加干涉,初始化完毕后,就会检测自己距离底部的长度,如果超过了限定,就会执行load事件 自动把绑定的loadind变为true -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
          <van-list v-model="upLoading" :finished="finished" @load="onload" finished-text="没有了">
          <van-cell-group>
              <van-cell title="美股又熔断了" :value="`天台排队${item}`" v-for="item in articles" :key="item"></van-cell>
          </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 表示是否开启了上拉加载
      finished: false, // 表示是否已经完成所有数据的加载
      articles: [], // 定义一个数组
      downLoading: false, // 下拉刷新状态 表示是否正在下拉刷新
      successText: ''// 刷新成功的文本
    }
  },
  methods: {
    // 上拉加载
    onload () {
      console.log('开始加载数据')
      // 如果你有数据,应该把数据加到list中
      if (this.articles.length > 50) {
        this.finished = true // 关闭加载
      } else {
        // Array.from()方法就是将一个类数据对象或者可遍历对象转换成一个真正的数组
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉数据 不是覆盖之前的数据 应该把数据追加到数组的尾部
        this.articles.push(...arr)
        // 添加完数据 需要手动关掉loading
        this.upLoading = false
      }
      // 如果你想关掉
      //   setTimeout(() => {
      //     this.finished = true // 表示数据已经加载完毕了 没有数据了
      //   }, 1000)
    },

    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        // 模拟下拉刷新数据
        const arr = Array.from(Array(2), (value, index) => '追加新数据' + (index + 1))
        // 数据添加到头部
        this.articles.unshift(...arr)
        // 手动关闭正在加载的状态
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style>

</style>
