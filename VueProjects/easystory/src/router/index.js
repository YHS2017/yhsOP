import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/Book',
    name: 'Book',
    component: () => import('../views/Book.vue'),
    props: (router) => ({ bookid: router.query.bookid })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
