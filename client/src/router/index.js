import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Dash from '../views/Dash.vue'
import Error from '../views/Error.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/error',
      name: 'Error',
      component: Error
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
      props: route => ({'code': route.query.code}),
      beforeEnter: async (to, from, next) => {
        var id = localStorage.getItem('id')
        if(id) return next('/')
        next()
      },
    },
    {
      path: '/dash',
      name: 'Dash',
      component: Dash,
      beforeEnter: (to, from, next) => {
        var user_id = localStorage.getItem('id')
        if(!user_id) return next('/')
        next()
      }
    },
  ]
})

export default router
