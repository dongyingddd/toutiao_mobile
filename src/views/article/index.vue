<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="article.aut_photo"
        />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button round size="small" type="info" @click="follow()">{{article.is_followed? '已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置评论组件 -->
      <Comment/>
    </div>
    <!-- 放置一个遮罩层 -->loading
    <van-overlay :show="loading">
      <!-- 加载进度条 -->
      <div class="loading-container">
        <van-loading type="spinner"/>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './components/comment'
export default {
  components: {
    Comment // 注册评论组件
  },
  data () {
    return {
      article: {}, // 接收文章数据
      loading: false
    }
  },
  methods: {
    // 关注和取消关注用户
    async follow () {
      console.log(this.article)
      try {
        debugger
        if (this.article.is_followed) {
        // 取消关注
          debugger
          await unfollowUser(this.article.aut_id) // 传入作者id
        } else {
          // 关注
          await followUser({ target: this.article.aut_id }) // 传入作者id
        }
        // 将状态修改为对立状态
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$gnotify({ message: '操作失败' })
      }
    },
    // 获取文章详情数据
    async getArticleInfo () {
      this.loading = true // 打开遮罩层
      const { artId } = this.$route.query
      this.article = await getArticleInfo(artId) // 查询结果
      this.loading = false // 关闭遮罩层
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang="less" scoped>
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;

}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
