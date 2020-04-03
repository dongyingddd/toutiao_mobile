<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center @click="showPhoto=true">
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <input ref="myFile" @change="upload()" type="file" style="display:none">
      <van-cell is-link title="名称" :value="user.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="user.gender === 0? '男': '女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showDate"/>
    </van-cell-group>

    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%" :close-on-click-overlay="false">
      <van-cell is-link title="本地相册选择图片" @click="openFileDialog"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层组件 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <van-button block type="info" @click="btnName" size="normal">确定</van-button>
    </van-popup>

    <!-- 性别弹层组件 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"/>

    <!-- 生日弹层组件 -->
    <van-popup v-model="showBirthDay" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="this.showBirthDay = false"
       />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto } from '@/api/user'

export default {
  data () {
    return {
      showPhoto: false, // 是否显示头像弹层
      showName: false, // 是否显示昵称弹层
      showGender: false, // 是否显示性别弹层
      showBirthDay: false, // 控制生日弹层

      actions: [{ name: '男' }, { name: '女' }], // 性别数据

      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间

      nameMsg: '', // 昵称的错误信息提示

      // 放置个人资料信息
      user: {
        name: '', // 昵称
        gender: 1, // 性别默认值
        birthday: '', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    // 打开选择文件的对话框
    openFileDialog () {
      this.$refs.myFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 修改头像
    async upload (params) {
      // 当选择完头像之后,就可以修改头像
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数是选择的图片文件
      const result = await updatePhoto(data) // 上传头像
      this.user.photo = result.photo // 把成功上传的图片地址设置给当前的data数据
      this.showPhoto = false // 关闭弹层
    },
    // 获取用户个人资料
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 对昵称的长度进行判断
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return // 不能够再继续
      }
      this.nameMsg = '' // 直接将错误信息置空
      this.showName = false // 关闭弹层
    },

    // 捕获点击上拉菜单选项的事件 select事件 再select事件中根据选择的选项进行判断
    selectItem (item, index) {
      this.user.gender = index // 直接把index赋值给性别 0: 男  1: 女
      this.showGender = false // 关闭弹层
    },

    // 显示生日弹层
    showDate () {
      // 打开生日弹层
      this.showBirthDay = true
      // 将当前的生日设置到选择日期的当前时间
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将Date类型转化为日期字符串
      this.showBirthDay = false // 关闭弹层
    }
  },

  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
