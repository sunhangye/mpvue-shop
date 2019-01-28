<template>
  <div class="goods">
    <!-- 轮播图 -->
    <div class="swiper">
      <swiper
        class="swiper-container"
        indicator-dots="true"
        auto-play="true"
        interval="3000"
        duration="1000"
      >
      <block v-for="(item, index) in gallery" :key="index">
        <swiper-item>
          <image :src="item.img_url" :alt="item.img_desc" class="slide-image" />
        </swiper-item>
      </block>
      </swiper>
      <button class="share" hover-class="none" open-type="share">分享商品</button>
    </div>
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>
    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div v-if="brand.name" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <!-- 规格数量 -->
    <div @click="showType" class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <!-- 商品参数 -->
    <div v-if="attribute.length !=0" class="attribute">
      <div class="head">商品参数</div>
      <div v-for="(item, index) in attribute" :key="index" class="item">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
      <div v-if="goods_desc" class="detail">
        <wxParse :content="goods_desc" />
      </div>
    </div>
    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">常见问题</text>
        <div class="line"></div>
      </div>
      <div class="b">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">
            {{item.answer}}
          </div>
        </div>
      </div>
    </div>
    <!-- 大家都在看 -->
    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">大家都在看</text>
        <div class="line"></div>
      </div>
      <div class="sublist">
        <div @click="togoodsDetail(item.id)" v-for="(subitem, subindex) in productList" :key="subindex">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retail_price}}</p>
        </div>
      </div>
    </div>
    <!-- 底部栏 -->
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' : '']"></div>
      </div>
      <div @click="toCart">
        <div class="car">
          <span>{{allnumber}}</span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="bug">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>
    <!-- 选择规格部分 -->
    <div v-show="showpop" @click="showType" class="pop"></div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{info.retail_price}}</p>
            <p>请选择数量</p>
          </div>
        </div>
        <div class="close" @click="showType">X</div>
      </div>
      <div class="b">
        <p>数量</p>
        <div class="count">
          <div class="cut" @click="reduce">-</div>
          <input class="number" type="number" disabled="" v-model="number">
          <div class="add" @click="add">+</div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import { get, post, login, getStorageOpenid, toLogin } from "../../utils"
import wxParse from "mpvue-wxparse"
export default {
  mounted() {
    if (login()) {
      this.userInfo = login()
    }

    this.id = this.$root.$mp.query.id
    this.openId = getStorageOpenid()
    this.goodsDetail()
  },
  data() {
    return {
      allnumber: 0, // 购物车数量
      openId: "",
      collectFlag: false, // 是否收藏
      number: 0,
      showpop: false,
      gallery: [], // 轮播图
      info: {}, // 当前商品信息
      brand: {},
      attribute: [], // 商品属性
      issueList: [], // 常见问题
      productList: [], // 推荐商品
      goods_desc: "",
      id: "",
      userInfo: "",
      goodsId: "",
      allPrise: ""
    }
  },
  components: {
    wxParse
  },
  methods: {
    async goodsDetail() {
      const data = await get("/goods/detailaction", {
        id: this.id,
        openId: this.openId
      })
      console.log(data)
      this.gallery = data.gallery
      this.info = data.info
      this.allPrise = data.info.retail_price
      this.goodsId = data.info.id
      this.brand = data.brand
      this.attribute = data.attribute
      this.goods_desc = data.info.goods_desc
      this.issueList = data.issue
      this.collectFlag = data.collected
      this.allnumber = data.allnumber
      this.productList = data.productList
    },
    onShareAppMessage() {
      return {
        title: this.info.name,
        path: `/pages/goodds/main?id=${this.info.id}`,
        imageUrl: this.gallery[0].img_url
      }
    },
    togoodsDetail(id) {
      wx.redirectTo({
        url: `/pages/goods/main?id=${id}`
      })
    },
    add() {
      this.number = this.number + 1
    },
    reduce() {
      if (this.number >= 1) {
        this.number = this.number - 1
      } else {
        return false
      }
    },
    async bug() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number === 0) {
            wx.showToast({
              title: '请选择商品数量',
              duration: 2000,
              icon: 'none',
              mask: true,
              success: res => {}
            })
            return false
          }

          const data = await post('/order/submitAction', {
            goodsId: this.goodsId,
            openId: this.openId,
            allPrise: this.allPrise
          })

          if (data) {
            wx.navigateTo({
              url: '/pages/order/main'
            })
          }
        } else {
          this.showpop = true
        }
      }
    },
    async collect() { // 收藏
      if (toLogin()) {
        this.collectFlag = !this.collectFlag
        const data = await post("/collect/addcollect", {
          openId: this.userInfo.openId,
          goodsId: this.goodsId
        })
        console.log(data)
      }
    },
    async addCart() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number === 0) {
            wx.showToast({
              title: '请选择商品数量',
              duration: 2000,
              icon: 'none',
              mask: true,
              success: res => {}
            })
            return false
          }
          const data = await post('/cart/addCart', {
            openId: this.userInfo.openId,
            goodsId: this.goodsId,
            number: this.number
          })

          if (data) {
            this.allnumber = this.allnumber + this.number
            wx.showToast({
              title: '添加商品成功',
              icon: 'success',
              duration: 1500
            })
          }
        } else {
          this.showpop = true
        }
      }
    },
    toCart() {
      wx.switchTab({
        url: '/pages/cart/main'
      })
    },
    showType() {
      this.showpop = !this.showpop
    }
  }
}
</script>
<style lang="scss" scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
  @import './style';
</style>


