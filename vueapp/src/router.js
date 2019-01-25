import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Child1 from './views/HomeChild1.vue'
import Child2 from './views/HomeChild2.vue'
import Child3 from './views/HomeChild3.vue'
import Child4 from './views/HomeChild4.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home/1',
      name: 'homechild1',
      component: Child1
    },
    {
      path: '/home/2',
      name: 'homechild2',
      component: Child2
    },
    {
      path: '/home/3',
      name: 'homechild3',
      component: Child3
    },
    {
      path: '/home/4',
      name: 'homechild4',
      component: Child4
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
