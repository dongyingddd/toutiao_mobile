<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <!-- 循环渲染我的频道 -->
        <van-grid-item v-for="(channel,index) in channels" :key="channel.id">
          <span class="f12" @click="$emit('selectChannel',channel.id)" :class="{red: index === activeIndex}">{{channel.name}}</span>
          <!-- 叉号的显示问题: 因该在进入编辑状态时显示,退出编辑状态时不显示 -->
          <!-- 因为第一个 永远不显示叉号,所以应该加一个 index !== 0 -->
          <van-icon class="btn" name="cross" v-if="index!== 0 &&editing" @click="$emit('delChannel',channel.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channel in optionalChannels" :key="channel.id">
          <span class="f12">{{channel.name}}</span>
          <van-icon class="btn" name="plus" @click="$emit('addChannel',channel)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  props: {
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  created () {
    this.getAllChannels()
  },
  computed: {
    optionalChannels () {
      // 可选频道 = 所有频道- 我的频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
