<template>
  <div class="container">
    <!-- 放置标签页组件 -->
    <van-tabs  v-model="activeIndex">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- 父传子 将频道id通过属性传值传递给子组件article-list -->
        <ArticleList :channel_id="item.id" @showAction="openAction"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 在tabs下放置图标 编辑频道的图标 -->
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>

    <van-popup v-model="showMoreAction" :style="{width:'80%'}">
      <MoreAction @dislike="dislikeArticle"/>
    </van-popup>
  </div>

</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
import MoreAction from './components/more-action'
import { dislikeArticle } from '@/api/articles'
import eventbus from '@/utils/eventbus'
export default {
  name: 'Home',
  components: {
    ArticleList, // 注册文章列表组件
    MoreAction // 注册更多操作组件
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件的显示与隐藏
      articleId: null, // 定义一个值接受文章id
      activeIndex: 1
    }
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels // 更新原来的数据
    },
    openAction (artId) {
      // 此时应该弹出反馈的层
      this.showMoreAction = true
      // 存储artId
      this.articleId = artId
    },
    // 对文章不感兴趣
    async dislikeArticle () {
      try {
        await dislikeArticle({
          target: this.articleId
        })
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该触发一个事件 利用事件广播的机制 通知对应的tab来删除文章数据
        // 除了传文章id之外,你还需要告诉监听事件的人,现在处于哪个频道 可以传频道id
        // this.channels[this.activeIndex].id 当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 关闭弹出层
        this.showMoreAction = false
      } catch (error) {
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
  .van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
