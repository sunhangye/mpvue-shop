<template>
  <div class="search">
    <div class="head">
      <div>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <input type="text" 
               confirm-type="search" 
               focus="true" 
               v-model="words" 
               @focus="inputFocus"
               @input="tipsearch"
               @confirm="searchWords"
               placeholder="搜索商品">
        <img class="del" @click="clearInput" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="searchTips" v-if="tipsData.length!=0">
      <div @click="searchWords"  :data-value="item.name" v-for="(item, index) in tipsData" :key="index">
        {{item.name}}
      </div>
      <div class="nogoods" v-if="tipsData.length == 0">
        暂无此类商品
      </div>
    </div>
    <div class="history" v-if="historyData.length != 0">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory"></div>
      </div>
      <div class="cont">
        <div @click="searchWords" :data-value="item.keyword" v-for="(item, index) in historyData" :key="index">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <div class="history hotSearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div @click="searchWords" v-for="(item, index) in hotData" :data-value="item.keyword" :key="index" :class="{active: 0==index}">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <!-- 商品列表 -->
    <div v-if="listData.length > 0" class="goodsList">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0==nowIndex?'active':'']">综合</div>
        <div @click="changeTab(1)" class="price" :class="[1==nowIndex ? 'active' : '', order=='desc' ? 'desc' : 'asc']">价格</div>
        <div @click="changeTab(2)" :class="[2==nowIndex?'active':'']">分类</div>
      </div>
      <div class="sortlist">
        <div class="item" @click="goodsDetail(item.index)" v-for="(item, index) in listData" :key="index" :class="listData.length%2==0?'active':'none'">
          <img :src="item.list_pic_url" alt="">
          <p class="name">{{item.name}}</p>
          <p class="price">{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { get, post } from '../../utils'
  export default {
    data() {
      return {
        nowIndex: 0,
        words: '',
        historyData: [],
        hotData: [],
        tipsData: [],
        listData: [], // 根据关键词推荐
        openid: '',
        order: ''
      }
    },
    mounted () {
      this.openid = wx.getStorageSync('openId') || ''
      this.getHotData()
    },
    components: {},
    methods: {
      inputFocus() {
        this.listData = []
      },
      async tipsearch() {
        const data = await get('/search/helperaction', {
          keyword: this.words
        })
        this.tipsData = data.keywords
        console.log(this.tipsData)
      },
      async searchWords(e) {
        const value = e.currentTarget.dataset.value
        this.words = value || this.words
        // 添加搜索历史记录
        const data = await post('/search/addhistoryaction', {
          openId: this.openid,
          keyword: value || this.words
        })
        console.log(data)
        // 获取历史记录
        this.getHotData()
        this.getListData()
      },
      async getHotData() {
        const data = await get(`/search/indexaction?openId=${this.openid}`)
        this.hotData = data.hotKeywordList
        this.historyData = data.historyData
      },
      async getListData() {
        const data = await get('/search/helperaction', {
          keyword: this.words,
          order: this.order
        })
        this.listData = data.keywords
        this.tipsData = []
      },
      clearInput() {
        this.words = ''
        this.listData = []
        this.tipsData = []
      },
      cancel() {
        wx.navigateBack({
          delta: 1 // 返回页面数，如果delta大于现有页面数，则返回首页
        })
      },
      changeTab(index) {
        this.nowIndex = index
        if (index === 1) {
          this.order = this.order === 'asc' ? 'desc' : 'asc'
        } else {
          this.order = ''
        }
        this.getListData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './style.scss'
</style>
