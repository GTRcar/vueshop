import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

import Home from '@/components/Home'
Vue.use(Router)

const router = new Router({
  routes: [
    //  {path: '/', name: 'HelloWorld', component: HelloWorld}
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  // /home路由需要token的存在(表示用戶处于登录状态)
  if (token === null && to.path !== '/login') {
    // 强制登录
    return next('/login')
  }
  // 继续执行当前路由
  next()
})

export default router
