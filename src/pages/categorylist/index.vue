<template>
  <div class="categoryList">
    <scroll-view scroll-x="true" :scroll-left="scrollLft" class="head">
      <div :class="[nowIndex === index ? 'active' : '']" @click="changeTab(index, item.id)" v-for="(item, index) in navData" :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <div class="info">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.front_desc}}</p>
    </div>
    <div class="list" v-if="goodList.length!=0">
      <div class="item" @click="goodsDetail(item.id)" v-for="(item, index) in goodList" :key="index">
        <img :src="item.list_pic_url" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">{{item.retail_price}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "../../utils"
export default {
  created () {},
  mounted () {
    this.categoryId = this.$root.$mp.query.id
    this.getAllData()
  },
  data() {
    return {
      categoryId: '',
      nowIndex: 0,
      goodList: [],
      navData: [],
      currentNav: {},
      scrollLeft: 0
    }
  },
  methods: {
    async changeTab(index, id) {
      this.nowIndex = index
      const listData = await get('/goods/goodsList', {
        categoryId: id
      })
      this.goodLsList = listData.data
      this.currentNav = listData.currentNav
    },
    async getAllData() {
      const navdata = await get('/category/categoryNav', {
        id: this.categoryId
      })

      this.navData = navdata.navData
      this.currentNav = navdata.currentNav
      for (let i = 0; i < navdata.length; i++) {
        const id = this.currentNav.id
        if (id === this.currentNav.id) {
          this.nowIndex = i
        }
      }

      if (this.nowIndex > 4) {
        this.scrollLeft = this.nowIndex * 60
      } else {
        this.scrollLeft = 0
      }

      const listdata = await get('/goods/goodsList', {
        categoryId: this.categoryId
      })
      this.goodList = listdata.data
    },
    goodsDetail(id) {
      wx.navigateTo({
        url: `/pages/goods/main?id=${id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './style'
</style>

