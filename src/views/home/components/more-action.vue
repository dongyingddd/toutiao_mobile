<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell icon="info-o" v-for="item in reports" :key="item.value" @click="$emit('report', item.value)">
          {{item.label}}
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants.js'
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports
    }
  },
  created () {
    // 只要文章一删除,就把弹层中的反馈组件重置为初始状态
    eventbus.$on('delArticle', () => { this.isReport = false })
  }
}
</script>

<style lang="less" scoped>
.more-action {
  border-radius: 4px;
}
</style>
