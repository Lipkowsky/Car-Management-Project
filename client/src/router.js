import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Signup from './views/Signup.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import myTravels from './views/myTravels.vue';
import Admin from './views/Admin.vue';
import VueJwtDecode from 'vue-jwt-decode'

Vue.use(Router);


function loggedInRedirectDashboard(to, from, next){
  if(localStorage.token){
      next('dashboard');
  }else{
    next();
  }
}

function isLoggedIn(to, from, next){
  if(localStorage.token){
      next();
  }else{
    next('/login');
  }
}

function isAdminLoggedIn(to, from, next){
  var temp = VueJwtDecode.decode(localStorage.token);
  if(temp.role === 'ADMIN'){
      next();
  }else{
    next('/login');
  }
}



export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loggedInRedirectDashboard,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/myTravels',
      name: 'myTravels',
      component: myTravels,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: isAdminLoggedIn,
    },
  ],
});
