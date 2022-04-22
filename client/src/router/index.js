import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Dash from '../views/Dash.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
      props: route => ({'code': route.query.code}),
    },
    {
      path: '/dash',
      name: 'Dash',
      component: Dash,
      beforeEnter: (to, from, next) => {
        var code = localStorage.getItem('code')
        if(!code) return next('/')
        next()
      }
    },
  ]
})

export default router
