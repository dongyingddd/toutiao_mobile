<template>
  <!-- 文章列表组件 放置列表-->
  <!-- van-list 可以帮我们实现上拉加载 需要一些变量 -->
  <!-- 这里放置这个div的目的时 形成滚动条 因为我们后期要做阅读记忆 -->
  <!-- 阅读记忆: 上次你阅读到哪 回来之后还是哪 -->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件 如果不加干涉,初始化完毕后,就会检测自己距离底部的长度,如果超过了限定,就会执行load事件 自动把绑定的loading变为true -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list v-model="upLoading" :finished="finished" @load="onload" finished-text="没有了">
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <!-- 一张图 -->
          <div class="article_item">
            <h3 class="van-ellipsis">111{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type === 3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]"/>
                <van-image class="w33" fit="cover" :src="item.cover.images[1]"/>
                <van-image class="w33" fit="cover" :src="item.cover.images[2]"/>
            </div>
            <div class="img_box" v-if="item.cover.type === 1 ">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate}}</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
export default {
  props: {
    channel_id: {
      required: true,
      type: Number,
      default: null
    }
  },
  data () {
    return {
      upLoading: false, // 表示是否开启了上拉加载
      finished: false, // 表示是否已经完成所有数据的加载
      articles: [], // 定义一个数组
      downLoading: false, // 下拉刷新状态 表示是否正在下拉刷新
      successText: '', // 刷新成功的文本
      timestamp: null // 存放时间戳
    }
  },
  methods: {
    // 上拉加载
    async onload () {
      console.log('开始加载数据')
      // 使用休眠函数 让请求延迟 防止用户加载太快 减轻服务器压力
      await this.$sleep()
      // 如果你有数据,应该把数据加到list中
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now()
      })
      //   console.log('data', data)

      // Array.from()方法就是将一个类数据对象或者可遍历对象转换成一个真正的数组
      // const arr = Array.from(
      //   Array(15),
      //   (value, index) => this.articles.length + index + 1
      // )
      // 上拉数据 不是覆盖之前的数据 应该把数据追加到数组的尾部
      this.articles.push(...data.results)
      // 添加完数据 需要手动关掉loading
      this.upLoading = false
      console.log(this.articles)

      // 将历史时间戳给 timestamp 但是赋值之前有个判断 需要判断历史时间戳是否为0
      // 如果历史时间戳为0 ,说明此时已经没有数据了,应该宣布结束
      // debugger
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示还有数据 可以继续加载
        this.timestamp = data.pre_timestamp
      } else {
        // 如果没有历史时间戳 表示没有数据加可以请求了
        this.finished = true
      }
    },

    // 下拉刷新
    async onRefresh () {
      // setTimeout(() => {
      //   // 模拟下拉刷新数据
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加新数据' + (index + 1)
      //   )
      //   // 数据添加到头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
      await this.$sleep()
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })

      // 手动关闭下拉刷新的状态
      this.downLoading = false
      // 判断最新的时间戳能否换来数据 ,如果能:把新数据整个替换旧数据 如果不能:就告诉大家暂时没有更新
      if (data.results.length) {
        // 替换历史数据
        this.articles = data.results
        // 此时 之前的全部数据已经被覆盖了 假如你之前把数据拉到了底端 也就意味着你之前的finished已经为true了
        if (data.pre_timestamp) {
          this.finished = false // 重新唤醒列表 让列表可以上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新的了'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
