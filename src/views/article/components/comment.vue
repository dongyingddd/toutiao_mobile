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
            <van-tag plain @click="showReply=true">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComment } from '@/api/articles'
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
      offset: null

    }
  },
  methods: {
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
