<template>
  <div class="index">
    <div class="search">
      <div @click="topMappage">{{cityName}}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品">
        <span class="icon"></span>
      </div>
    </div>
    <div class="swiper">
      <swiper
        class="swiper-container"
        indicator-dots="true"
        autoplay="true"
        interval="3000"
        circular="true"
        duration="500"
      >
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <img class="slide-image" :src="item.image_url" :alt="item.name">
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="channel">
      <div v-for="(item, index) in channel" :key="index">
        <img :src="item.icon_url" :alt="item.name">
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="brand">
      <div @click="tobrandList" class="head">品牌制造商直供</div>
      <div class="content">
        <div @click="branddetail(item.id)" v-for="(item, index) in brandList" :key="index">
          <div>
            <p>{{item.name}}</p>
            <p>{{item.floor_price}}元起</p>
          </div>
          <img :src="item.new_pic_url" alt>
        </div>
      </div>
    </div>
    <div class="newgoods">
      <div @click="goodsList('new')" class="newgoods-top">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt>
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newgoods hotgoods">
      <div @click="goodsList('hot')" class="newgoods-top">
        <div class="top">
          <p>
            人气推荐
            <span></span> 好物精选
          </p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt>
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="topicList">
      <div @click="totopic" class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="topicdetail(item.id)" v-for="(item, index) in topicList" :key="index">
              <img :src="item.item_pic_url" alt>
              <div class="btom">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.subtitle}}</p>
                </div>
                <div>{{item.price_info}}元起</div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
        <div class="head">{{item.name}}好物</div>
        <div class="sublist">
          <div
            @click="goodsDetail(subitem.id)"
            v-for="(subitem, subindex) in item.goodsList"
            :key="subindex"
          >
            <img :src="subitem.list_pic_url" alt>
            <p>{{subitem.name}}</p>
            <p>￥{{subitem.retail_price}}</p>
          </div>
          <div @click="categoryList(item.id)">
            <div class="last">
              <p>{{item.name}}好物</p>
              <span class="icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx"
import { mapState, mapMutations } from "vuex"
import { get } from "../../utils"

export default {
  onShow() {},
  computed: {
    ...mapState(['cityName'])
  },
  data() {
    return {
      banner: [],
      channel: [],
      newGoods: [],
      hotGoods: [],
      brandList: [],
      topicList: [],
      newCategoryList: []
    }
  },
  created() {},
  mounted() {
    this.getCityName()
    this.getDate()
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
    ...mapMutations(["update"]),
    getCityName() {
      var _this = this
      var myAmapFun = new amapFile.AMapWX({
        key: 'e545e7f79a643f23aef187add14e4548'
      })

      myAmapFun.getRegeo({
        success: function(res) {
          _this.update({ cityName: res[0].regeocodeData.formatted_address })
        },
        fill: function(err) {
          console.log(err)
          _this.cityName = '北京'
          _this.update({ cityName: '北京' })
        }
      })
    },
    async getDate() {
      const data = await get('/index/index')
      console.log(data)
      this.banner = data.banner
      this.channel = data.channel
      this.newGoods = data.newGoods
      this.hotGoods = data.hotGoods
      this.brandList = data.brandList
      this.topicList = data.topicList
      this.newCategoryList = data.newCategoryList
    },
    toSearch() {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    goodsDetail(id) {
      wx.navigateTo({
        url: '/pages/goods/main?id=' + id
      })
    },
    categoryList(id) {
      wx.navigateTo({
        url: '/pages/categorylist/main?id=' + id
      })
    },
    goodsList(info) {
      if (info === 'hot') {
        wx.navigateTo({
          url: '/pages/newgoods/main?isHot=' + 1
        })
      } else {
        wx.navigateTo({
          url: '/pages/newgoods/main?isNew=' + 1
        })
      }
    },
    topicdetail(id) {
      wx.navigateTo({
        url: '/pages/topicdetail/main?id=' + id
      })
    },
    totopic() {
      wx.navigateTo({
        url: '/pages/topic/main'
      })
    },
    tobrandList() {
      wx.navigateTo({
        url: '/pages/brandlist/main'
      })
    },
    branddetail(id) {
      wx.navigateTo({
        url: '/pages/branddetail/main?id=' + id
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  @import "./style.scss"
</style>

