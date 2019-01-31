<template>
  <div class="address">
    <scroll-view scroll-y="true" class="addcont" style="height: 100%;">
      <!-- <div class="addcont"> -->
      <div v-if="listData.length!=0" class="item">
        <div class="list" v-for="(item, index) in listData" :key="index">
          <div class="addresslist" :style="item.textStyle">
            <div>
              <span>{{item.name}}</span>
              <div v-if="item.is_default" class="moren">
                默认
              </div>
            </div>
            <div @click="selAddress(item.id)" class="info">
              <p>{{item.mobile}}</p>
              <p>{{item.address+item.address_detail}}</p>
            </div>
            <div @click="toDetail(item.id)"></div>

          </div>
        </div>

      </div>

      <div v-else class="center">
        <p>收货地址在哪里?</p>
      </div>
    </scroll-view>
    <div class="bottom">
      <div @click="wxaddress(1)">+新建地址</div>
      <div @click="wxaddress">一键导入微信地址</div>
    </div>
  </div>
</template>
<script>
import {get, getStorageOpenid} from '../../utils'
export default {
  onShow() {
    this.openId = getStorageOpenid()
  },
  data () {
    return {
      openId: '',
      listData: ''
    }
  },
  methods: {
    async getAddressList() {
      const data = await get('/address/getListAction', {
        openId: this.openId
      })
      console.log(data)
      this.listData = data.data
    },
    toDetail(id) {
      wx.navigateTo({
        url: "/pages/addaddress/main?id=" + id
      })
    },
    selAddress(id) { // 选择地址保存id返回支付页
      wx.setStorageSync('addressId', id)
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      })
    },
    wxaddress(index) {
      if (index === 1) {
        wx.navigateTo({
          url: '/pages/addaddress/main'
        })
        return
      }
      wx.chooseAddress({
        success: function(res) {
          const data = encodeURIComponent(JSON.stringify(res))
          wx.navigateTo({
            url: '/pages/addaddress/main?res=' + data
          })
        },
        fail: function(res) {
          console.log(`地址授权失败：${res.errMsg}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./style";
</style>
