import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import ManageView from '@/views/ManageView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/manage',
    /*alias: '/manage-music',*/
    name: 'manage',
    component: ManageView,
    /*
    beforeEnter: (to, from, next) => {
      next();
    } // validation before entering on SPECIFIC Route
    */
  },
  {
    path: '/manage-music',
    redirect: { name: 'manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

/*router.beforeEach((to, from, next) => {}) // if it needs to be run before each route */

export default router
