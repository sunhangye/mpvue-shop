<template>
  <div class="mappage">
    <div class="section">
      <input @input="bindInput" type="text" placeholder="搜索" v-model="keywords" focus="true">
    </div>
    <scroll-view :scroll-y="true" class="addcont" style="height:500rpx;">
      <div class="result" @touchstart="bindSearch(item.name)" v-for="(item, index) in tips" :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <div class="map_container">
      <div class="title">显示当前位置</div>
      <map class="map" name="map" :longitude="longitude" :latitude="latitude"></map>
    </div>
  </div>
</template>

<script>
import amapFile from '../../utils/amap-wx'
import { mapMutations } from 'vuex'

export default {
  created () { },
  data() {
    return {
      tips: [],
      keywords: '',
      longitude: '',
      latitude: '',
      markers: []
    }
  },
  components: { },
  mounted () {
    this.getMapaddress()
  },
  methods: {
    ...mapMutations(['update']),
    bindInput: function (e) {
      var _this = this
      var keywords = _this.keywords
      var myAmapFun = new amapFile.AMapWX({
        key: 'e545e7f79a643f23aef187add14e4548'
      })
      myAmapFun.getInputtips({
        keywords: keywords,
        location: '',
        success: function(data) {
          if (data && data.tips) {
            _this.tips = data.tips
          }
        }
      })
    },
    bindSearch: function(cityName) {
      this.update({cityName: cityName})
      wx.navigateBack({
        dalta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      })
    },
    getMapaddress: function () {
      var _this = this
      var myAmapFun = new amapFile.AMapWX({
        key: 'e545e7f79a643f23aef187add14e4548'
      })
      myAmapFun.getRegeo({
        iconPath: '/static/images/marker.png',
        iconWidth: 22,
        iconHeigth: 32,
        success: function (data) {
          var marker = [
            {
              id: data[0].id,
              latitude: data[0].latitude,
              longitude: data[0].longitude,
              iconPath: data[0].iconPath,
              width: data[0].width,
              height: data[0].height
            }
          ]
          _this.markers = marker
          _this.latitude = data[0].latitude
          _this.longitude = data[0].longitude
        },
        fill: function(info) {
          wx.showModal({title: info.errMsg})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './style'
</style>
