import Vue from 'vue'
import VueRouter from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// 路由懒加载目的是: 拆解成每个组件自己的小js
// const Foo = () => import('./Foo.vue')

const Login = () => import('@/components/Login') 
const Home = () => import('@/components/Home') 
const Welcome = () => import('@/components/Welcome') 
const User = () => import('@/components/User') 
const Rights = () => import('@/components/Rights') 
const Role = () => import( '@/components/Role')
const Cat = () => import('@/components/Cat') 
const Param = () => import('@/components/Param') 
const Goods = () => import('@/components/Goods') 
const GoodsAdd = () => import('@/components/GoodsAdd') 
const Order = () => import('@/components/Order') 
const Reports = () => import('@/components/Reports') 
Vue.use(VueRouter)

const router = new VueRouter({
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
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Reports
        }
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
