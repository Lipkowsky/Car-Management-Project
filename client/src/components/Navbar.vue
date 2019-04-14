<template>
  <nav>
    <div class="toggle">
      <font-awesome-icon class="menu" icon="bars" />
    </div>
    <ul>
      <li v-if="auth==''"><router-link class="nav-link" to="/">Car Management Project</router-link></li>
      <li v-if="auth==''"><router-link class="nav-link" to="/login">Logowanie</router-link></li>
      <li v-if="auth==''"><router-link class="nav-link" to="/register">Rejestracja</router-link></li>
      <li v-if="auth=='loggedin'"><router-link class="nav-link" to="/profile">Profil</router-link></li>
      <li v-if="auth=='loggedin'"><a class="nav-link" href="" v-on:click="logout">Wyloguj</a></li>
    </ul>
  </nav>
</template>


<script>
  import Vue from 'vue'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faBars } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  // We import JQuery
  const $ = require('jquery');
  // We declare it globally
  window.$ = $;




  library.add(faBars)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  Vue.config.productionTip = false


import EventBus from './EventBus'
  EventBus.$on('logged-in', test =>{
    console.log(test);
  })
  export default {
    data() {
      return {
        auth: '',
        user: '',
      }
    },
    methods: {
      logout () {
        localStorage.removeItem('usertoken')
        this.auth = '';
      },
    },
      mounted() {
        EventBus.$on('logged-in', status => {
          this.auth = status;
        })
        if(localStorage.getItem('usertoken')){
          this.auth = 'loggedin';
        }else{
          this.auth = ''
        }
        //hamburger open on media
        $(document).ready(function () {
          $('.menu').click(function(){
            $('ul').toggleClass('active')
          })
        })
      }
  }
</script>

<style scoped>
  nav{
     margin: 0;
     padding: 0;
     font-family: sans-serif;
     width: 100%;
     background: #00316b;
    color: #fff;
   }
  ul{
    width: 80%;
    margin: 0 auto;
    padding: 0;
  }
  ul li{
    list-style: none;
    display: inline-block;
    padding: 20px;
  }
  .nav-link:hover{
    background: #e91e63;
  }
  .nav-link
  {
   background-image: linear-gradient(#601146, #e91e63);
    color:#fff;
    text-decoration: none;
  }
  .toggle{
    width: 100%;
    padding: 10px 20px;
    background: #001f44;
    text-align: right;
    box-sizing: border-box;
    font-size: 30px;
    display: none;
  }
  @media (max-width: 768px){
    .toggle{
      display: block;
    }
    ul{
      width: 100%;
      display: none;
    }
    ul li{
      display: block;
      text-align: center;
    }
    .active{
      display: block;
    }

  }

</style>
