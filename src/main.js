// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'

// 引入全局的css样式文件
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'

import '../src/assets/font_g8yh065nr6/iconfont.css'

// 注册组件给vue
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  render: c => c(App)
})
