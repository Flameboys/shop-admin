import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Category from '../components/products/category.vue'
import Goods from '../components/products/goods.vue'
import GoodsAdd from '../components/products/goodsadd.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  { path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/goods', component: Goods },
      { path: '/rights', component: Rights },
      { path: '/goods-add', component: GoodsAdd }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
