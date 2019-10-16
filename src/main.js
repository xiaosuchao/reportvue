import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import '@/assets/skins/benz/index.scss'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
// import './mock' // simulation data

import '@/icons' // icon
import '@/permission' // permission control
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css' // vue图片查看器
import echarts from 'echarts'
// import axios from 'axios'
Vue.prototype.$echarts = echarts
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
Vue.use(ElementUI, {
  locale
})
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
console.log(process.env)

// store.dispatch('setskin', 'benz')
// axios({
//   url: process.env.BASE_API + '/orgInfo',
//   method: 'get'
// }).then(res => {
//   console.log(res)
//   if (res.data && res.data.code === 0) {
//     store.dispatch('SetSysInfo', res.data.data)
//   } else {
//     // console.log('获取机构信息失败')
//   }
// }).catch(err => {
//   console.log(err)
// })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
