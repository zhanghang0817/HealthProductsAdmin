// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import VueResource from 'vue-resource'
import Highcharts from 'highcharts'
// import md5 from 'js-md5'
// import MD5 from './assets/md5.js'
// let MD5 = require('./assets/md5.js')
// Object.definePrototype(Vue.prototype, '$md5', { value: md5 })

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(Highcharts)
// Vue.use(MD5)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})

// 全局过滤器
// 时间戳
Vue.filter('timeDateChange', function (nS) {
  if (!nS || isNaN(nS)) {
    return ''
  }
  var date = new Date(parseInt(nS))
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
  // var s = date.getSeconds()
  return Y + M + D + h + m
})

Vue.filter('timeDateFormatChange', function (nS) {
  if (!nS || isNaN(nS)) {
    return ''
  }
  var date = new Date(parseInt(nS))
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  return Y + M + D
})

// 处理状态转化
Vue.filter('dealStatus', function (st) {
  switch (st) {
    case 0:
      return '未处理'
    case 3:
      return '已处理'
    default:
      return '--'
  }
})
// 截取标题
Vue.filter('subStr', function (value) {
  if (!value) return ''
  value = value.toString()
  if (value.length > 15) {
    return value.substring(0, 15) + '...'
  } else {
    return value
  }
})
// 截取简介
Vue.filter('splitStr30', function (value) {
  if (!value) return ''
  value = value.toString()
  if (value.length > 30) {
    return value.substring(0, 30) + '...'
  } else {
    return value
  }
})
// 解码
Vue.filter('decodeStr', function (value) {
  if (!value) return ''
  value = value.toString()
  return decodeURI(value)
})
