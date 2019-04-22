// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router/index.js'
// 引入全局的css样式文件
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'

// 引入font字体图标
import './assets/font/iconfont.css'

// 引入axios模块
import axios from 'axios'
// 注册组件给vue
Vue.use(ElementUI)

Vue.config.productionTip = false
// axios做配置
// 给axios配置公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
