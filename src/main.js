import Vue from 'vue'
import App from './App'
// 引入store
import store from './store/index'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    'pages': [
      'pages/index/main'
    ],
    'window': {
      'backgroundTextStyle': 'light',
      'navigationBarBackgroundColor': '#fff',
      'navigationBarTitleText': 'Mpvue',
      'navigationBarTextStyle': 'black'
    }
  }
}