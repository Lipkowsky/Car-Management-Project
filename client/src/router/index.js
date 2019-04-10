import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Profile from '@/components/Profile'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    }
  ]
})


const openRoutes = ['Login','Register','Home'];
router.beforeEach((to, from, next) => {
  if(openRoutes.includes(to.name) ){
  next()
  }else if(localStorage.getItem('usertoken')){
    next()
  }else{
    next('/login')
  }
});

export default router


