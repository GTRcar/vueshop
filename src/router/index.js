import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Role from '@/components/Role'
import Cat from '@/components/Cat'
import Param from '@/components/Param'
import Goods from '@/components/Goods'
import GoodsAdd from '@/components/GoodsAdd'
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
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Role
        },
        {
          path: '/categories',
          component: Cat
        },
        {
          path: '/params',
          component: Param
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goodsadd',
          component: GoodsAdd
        },
      ]
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
