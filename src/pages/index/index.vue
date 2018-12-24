<template>
  <div class="index">
    <div class="search">
      <div @click="topMappage">{{cityName}}</div>
      <div>
        <input type="text" placeholder="搜索商品">
        <span class="icon"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import amapFile from '../../utils/amap-wx'
  import { mapState, mapMutations } from 'vuex'

  export default {
    onShow() {},
    computed: {
      ...mapState(['cityName'])
    },
    data() {
      return {
        banner: []
      }
    },
    created() {},
    mounted () {
      this.getCityName()
    },
    methods: {
      topMappage() {
        var _this = this
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        wx.getSetting({
          success(res) {
            console.log(res)
            // 已授权重新获取
            if (!res.authSetting['scope.userLocation']) {
              wx.openSetting({
                success: res => {
                  _this.getCityName()
                }
              })
            } else {
              wx.navigateTo({
                url: '/pages/mappage/main'
              })
            }
          }
        })
      },
      ...mapMutations(['update']),
      getCityName() {
        var _this = this
        var myAmapFun = new amapFile.AMapWX({
          key: 'e545e7f79a643f23aef187add14e4548'
        })

        myAmapFun.getRegeo({
          success: function (res) {
            console.log(res)
            _this.update({cityName: res[0].regeocodeData.formatted_address})
          },
          fill: function (err) {
            console.log(err)
            _this.cityName = '北京'
            _this.update({cityName: '北京'})
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import "./style.scss";
</style>

