<template>
  <div class="cart">
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <div class="cartlist">
      <div class="item" v-for="(item, index) in listData" :key="index" @touchstart="startMove" @touchmove="deleteGoods" @touchend="endMove" :data-index="index">
        <div class="con" :style="item.textStyle">
          <div class="left">
            <div class="icon" @click="changeColor(index, item.goods_id)" :class="[ Listids[index] ? 'active' : '', {active: allcheck}]"></div>
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">x{{item.number}}</div>
          </div>
        </div>
        <div @click="delGoods(item.id, index)" class="delete" :style="item.textStyle">
          <div>删除</div>
        </div>
      </div>
      
    </div>

    <div v-if="false" class="nogoods">
      <img
        src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png"
        alt
      >
    </div>

    <div class="fixed">
      <div class="left" :class="[allcheck ? 'active' : '']" @click="allCheck">全选({{checkedNumber}})</div>
      <div class="right">
        <div>￥{{allPrice}}</div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post, getStorageOpenid } from "../../utils"
const DEL_BTN_WIDTH = 100 // 删除按钮宽度
export default {
  onShow() {
    this.openId = getStorageOpenid()
    this.getListData()
  },
  data() {
    return {
      openId: "",
      allcheck: false,
      listData: [], // 购物车数据
      Listids: [], // 选中队列
      tranX: 0, // 样式移动距离
      startX: "",
      moveX: "",
      X: 0 // 手势移动距离
    }
  },
  methods: {
    initTextStyle() { // 初始化按钮状态
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].textStyle = ''
      }
    },
    async getListData() { // 获取购物车数据
      const data = await get("/cart/cartList", {
        openId: this.openId
      })
      data.data.forEach(element => {
        element.textStyle = ''
      })
      this.listData = data.data
    },
    allCheck() { // 全选
      // 先清空选中ID
      this.Listids = []
      if (this.allcheck) {
        this.allcheck = false
        return false
      }
      this.allcheck = true
      console.log('全部选中')
      for (let i = 0; i < this.listData.length; i++) {
        const element = this.listData[i]
        this.Listids.push(element.goods_id)
      }
      console.log(this.Listids)
    },
    changeColor(index, id) {
      // 单选，放到选中队列 判断有则选中
      if (this.Listids[index]) {
        this.$set(this.Listids, index, false)
      } else {
        this.$set(this.Listids, index, id)
      }
      console.log(index, this.Listids[index])
      console.log(this.Listids)
    },
    startMove(e) {
      this.initTextStyle()
      this.startX = e.touches[0].pageX
      this.startY = e.touches[0].pageY
    },
    deleteGoods(e) { // startmove
      this.initTextStyle()
      const index = e.currentTarget.dataset.index
      this.moveX = e.touches[0].pageX
      this.X = this.startX - this.moveX
      if (this.X === 0 || this.X < 0) {
        this.tranX = 0
      }
      if (this.X > DEL_BTN_WIDTH) {
        this.tranX = DEL_BTN_WIDTH
      }
      this.listData[index].textStyle = `transform:translateX(${-this.tranX}rpx)`
    },
    endMove(e) {
      const index = e.currentTarget.dataset.index
      if (this.X > DEL_BTN_WIDTH / 2) {
        this.tranX = DEL_BTN_WIDTH
      } else {
        this.tranX = 0
      }
      this.listData[index].textStyle = `transform:translateX(${-this.tranX}rpx)`
    },
    async delGoods(id, index) { // 删除商品
      const _this = this
      wx.showModal({
        title: '',
        content: '是否删除该商品',
        success: function(res) {
          if (res.confirm) {
            _this.Listids.splice(index, 1)
            post('/cart/deleteAction', {
              id: id
            }).then(() => {
              _this.getListData()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            _this.initTextStyle()
          }
        }
      })
    },
    async orderDown() {
      if (this.Listids.length === 0) {
        wx.showToast({
          title: '请选择一件商品下单',
          icon: 'none',
          duration: 1000
        })
        return
      }

      let newGoods = this.Listids.filter((item) => {
        return item
      })
      const data = await post('/order/submitAction', {
        goodsId: newGoods.join(','),
        openId: this.openId,
        allPrise: this.allPrice
      })
      if (data) {
        wx.navigateTo({
          url: "/pages/order/main"
        })
      }
    }
  },
  computed: {
    allPrice() {
      let price = 0
      this.listData.forEach((item) => {
        price += item.retail_price * item.number
      })
      return price
    },
    checkedNumber() {
      let number = 0
      this.Listids.forEach((item) => {
        if (item) {
          number++
        }
      })
      if (number === this.Listids.length && number !== 0) {
        this.allcheck = true
      } else {
        this.allcheck = false
      }
      return number
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style";
</style>

