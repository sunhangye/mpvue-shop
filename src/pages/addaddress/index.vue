<template>
  <div class="addaddress">
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName">
    </div>
    <div class="item">
      <input type="text" placeholder="手机号" v-model="telNumber">
    </div>
    <div class="item">
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <input type="text" placeholder="身份、城市、区县" v-model="address">
      </picker>
    </div>
    <div class="item">
      <input type="text" placeholder="详细地址，如楼道、楼盘号等" v-model="detailadress">
    </div>
    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox class="box" value="true" :checked="checked" color="#B4282D">设置为默认地址</checkbox>
        </label>
      </checkbox-group>
      <div @click="wxaddress">一键导入微信></div>
    </div>
    <div class="bottom" @click="saveAddress">保存</div>
  </div>
</template>
<script>
import {get, getStorageOpenid} from '../../utils'
export default {
  mounted () {
    this.openId = getStorageOpenid()
    if (this.$root.$mp.query.res) {
      this.res = JSON.parse(decodeURIComponent(this.$root.$mp.query.res))
      console.log(this.res)
      this.userName = this.res.userName
      this.telNumber = this.res.telNumber
      this.address = `${this.res.provinceName} ${this.res.cityName} ${this.res.countyName}`
      this.detailadress = this.res.detailInfo
    }
  },
  data () {
    return {
      region: [],
      res: {},
      openId: '',
      id: '', // 地址ID
      customItem: "全部",
      userName: '',
      telNumber: "",
      address: "",
      detailadress: "",
      checked: false
    }
  },
  methods: {
    async getDetail() {
      const data = await get("/address/detailAction", {
        id: this.id
      })
      this.userName = data.name
      this.telNumber = data.mobile
      this.address = data.address
      this.detailadress = data.address_detail
      this.checked = data.is_default !== 1
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './style'
</style>

