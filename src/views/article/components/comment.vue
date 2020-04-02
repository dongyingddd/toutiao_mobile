<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit()">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的回复列表 -->
     <van-action-sheet @closed="reply.commentId = null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComment, commentOrReply } from '@/api/articles'

export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 用来存放评论列表数据
      comments: [],
      // 表示分页依据,如果为空表示从第一页开始
      offset: null,

      showReply: false, // 控制评论的评论面板是否显示
      reply: {
        commentId: null, // 用来存放当前点击的评论id
        loading: false, // 评论的评论的加载状态
        finished: false, // 评论的评论是否加载完毕
        list: [], // 存放评论的评论数据
        offset: null // 偏移量
      }

    }
  },
  methods: {
    // 提交评论
    // 点击时要做什么?
    // 因为此时并没有判断用户是否登录了 先判断用户是否登录 如果没有登录 不让评论 如果登录了 才可以继续
    async submit () {
      if (this.$store.state.user.token) {
        if (!this.value) return false // 如果输入框没有内容 直接返回
        // 如果有内容
        // 先把提交状态打开 表示在提交中 避免重复提交 只有当提交完毕之后才关闭状态
        this.submiting = true
        // 休眠函数 来控制执行的速度
        await this.$sleep(800) // 强制休眠800毫秒
        try {
          // 提交评论核心内容
          const data = await commentOrReply({
            // 要么是文章id 要么是评论id 需要根据你当前是对谁进行评论
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId,
            content: this.value,
            // 如果是对评论进行评论 需要传该评论属于哪个文章 如果是对文章进行评论 不要传这个参数
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          if (this.reply.commentId) {
            // 如果是对评论及逆行评论
            this.reply.list.unshift(data.new_obj)
            // 如果是对评论进行评论 需要找到对应的评论id 将评论的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            comment && comment.reply_count++ // 如果找到 就将回复数量+1
          } else {
            // 如果是对文章进行评论
            this.comments.unshift(data.new_obj)
          }
          this.value = ''
        } catch (error) {
          this.$gnotify({ message: '评论失败' })
        }
        this.submiting = false // 状态关闭
      } else {
        try {
          await this.$dialog.confirm({
            message: '如果想要评论,你需要去登录'
          })
          // 如果点击了确定 需要跳到登陆页面
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath // 此地址是用户登录成功之后,需要回到的页面地址
            }
          })
        } catch (error) {
          console.log('点击了取消')
        }
      }
    },
    // 打开回复
    openReply (commentId) {
      this.showReply = true // 打开
      this.reply.commentId = commentId // 处理点击的谁的回复评论
      // 弹出面板的时候重置数据
      this.reply.finished = false
      this.reply.list = []
      this.reply.offset = null
      this.reply.loading = true // 主动打开加载状态 因为此时没有 主动检查
      // 弹出评论的评论的层时,主动请求一次数据
      this.getReply()
    },
    async getReply () {
      const data = await getComment({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭加载状态
      this.reply.finished = data.last_id === data.end_id
      if (!this.finished) {
        // 如果不等 表示还有下一页数据
        this.reply.offset = data.last_id // 将下一页的分页依据传递给当前数据
      }
    },
    // 加载评论数据方法,滚动条距离底部超过一定距离时触发
    async onLoad () {
      const { artId } = this.$route.query
      const data = await getComment({
        type: 'a', // a : 文章的评论 c: 评论的评论
        source: artId, // 表示你查询的谁的评论
        offset: this.offset // 赋值你当前的偏移量
      })
      this.comments.push(...data.results) // 将评论数据追加到评论列表尾部
      this.loading = false // 关闭上拉加载状态
      // 需要判断是否还有下一页数据
      this.finished = data.last_id === data.end_id // 如果这两个id相等 就没有下一页数据了
      if (!this.finished) {
        // 还有下一页数据
        this.offset = data.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
