<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search" @click="toSearchResult(text)" v-for="(text,index) in suggestList" :key="index">
        <span>{{text}}</span>
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toSearchResult(text)" v-for="(text,index) in historyList" :key="index">
          <a class="word_btn">{{text}}</a>
          <van-icon @click="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'hm-94-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      q: '', // 记录搜索关键字
      historyList: [], // 作为一个数据变量,接收搜索记录
      suggestList: [] // 联想搜索建议
    }
  },
  methods: {
    // 删除某个历史记录
    delHistory (index) {
      // 删除要先在data中删除数据, 然后把data中的数据同步到本地缓存中
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 同步到缓存
    },

    // 去搜索结果
    toSearchResult (text) {
      this.$router.push('/search/result?q=' + text)
    },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有历史记录吗'
        })
        this.historyList = [] // 将本地历史记录设置为空
        localStorage.setItem(key, '[]') // 同步设置缓存中的历史记录为空
      } catch (error) {
        // 失败不需要处理
      }
    },
    // 搜索按钮 回车或者虚拟键盘搜索 => 搜索事件
    onSearch () {
      // 首先判断搜索内容是否为空,为空直接返回
      if (!this.q) return
      // 将搜索内容加入到历史记录
      this.historyList.push(this.q)
      // 去重
      this.historyList = Array.from(new Set(this.historyList))
      // 设置到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳到搜索结果页,并携带参数
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem('hm-94-toutiao-history') || '[]')
  },
  watch: {
    q () {
      // 一:  通过函数防抖进行联想搜索

      // clearTimeout(this.timer) // 先清楚定时器
      // this.timer = setTimeout(async () => {
      //   // 需要判断 当清空的时候不能发请求
      //   if (!this.q) {
      //     this.suggestList = []
      //   }
      //   console.log(this.q)
      //   const data = await getSuggestion({ q: this.q })
      //   this.suggestList = data.options
      // }, 300)

      // 二: 通过函数节流进行联想搜索
      if (!this.timer) {
        // 要求300毫秒执行一次
        this.timer = setTimeout(async () => {
          this.timer = null // 先将标记置空
          //  需要判断 当清空的时候 不能发送请求 但是要把联想建议清空
          if (!this.q) {
            this.suggestList = []
          }
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options
        }, 300)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
