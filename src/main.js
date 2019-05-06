// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 声明使用过滤器--
import moment from 'moment' 

import router from './router/index.js'

// 引入全局的css样式文件
import './assets/css/global.css'

// 引入element-ui
import ElementUI from 'element-ui'

// 引用面包屑组件
import ComCrumb from './components/Share/Crumb.vue'

// 应用饿了吗组件的css样式
import 'element-ui/lib/theme-chalk/index.css';

// 引入font字体图标
import '../src/assets/fonts/iconfont.css'

// 引入axios模块
import axios from 'axios'
// 注册组件给vue
Vue.use(ElementUI)

// 注册为共有组件
Vue.component('com-crumb', ComCrumb)

Vue.config.productionTip = false
// axios做配置
// 给axios配置公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// 给axios设置请求拦截器。
// config:axios的配置對象，具体是axios内部的子级成员
axios.interceptors.request.use(
  function (config) {
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    // console.log(config)
    return config

  },
  function (error) {
    return Promise.reject(error)
  }
)
// 过滤器
Vue.filter('dateFormat',(v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
