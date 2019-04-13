<template>

  <header>
    <div class="container">
      <nav>
        <h1 class="brand"><router-link class="nav-link" to="/">Car <span>Management </span>Project</router-link></h1>
        <ul>
          <li v-if="auth==''" class="nav-item">
            <router-link class="nav-link" to="/login">Logowanie</router-link>
          </li>
          <li v-if="auth==''" class="nav-item">
            <router-link class="nav-link" to="/register">Rejestracja</router-link>
          </li>
          <li v-if="auth=='loggedin'" class="nav-item">
            <router-link class="nav-link" to="/profile">Profil</router-link>
          </li>
          <li v-if="auth=='loggedin'" class="nav-item">
            <a class="nav-link" href="" v-on:click="logout">Wyloguj</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>


<script>
import EventBus from './EventBus'
  EventBus.$on('logged-in', test =>{
    console.log(test);
  })
  export default {
    data() {
      return {
        auth: '',
        user: ''
      }
    },
    methods: {
      logout () {
        localStorage.removeItem('usertoken')
        this.auth = '';
      }
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
      },
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Oswald');
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  a{
    text-decoration: none;
    color: #eee;
  }

  header{
    width: 100%;
    height: 7vh;
    background-image: linear-gradient(#010a0c,#23454f,#3f5a60);
    background-size: cover;
    font-size: 1.2rem;
  }
  .container{
    max-width:120rem;
    width: 90%;
    margin: 0 auto;
  }
  nav{
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
    font-family: 'Oswald', sans-serif;
  }
  .brand{
    font-size: 3rem;
    font-weight: 300;
    transform: translateX(-100rem);
    animation: slideIn .5s forwards;
  }
  .brand span{
    color: #06d7e9;
  }
  nav ul{
    display: flex;
  }
  nav ul li{
    list-style: none;
    transform: translateX(100rem);
    animation: slideIn .5s forwards;
  }
  nav ul li:nth-child(1){
    animation-delay: 0s;
  }
  nav ul li:nth-child(2){
    animation-delay: 0.5s;
  }
  nav ul li:nth-child(3){
    animation-delay: 1s;
  }
  nav ul li:nth-child(4){
    animation-delay: 1.5s;
  }
  nav ul li a{
    padding: 1rem 0;
    margin: 0 3rem;
    position: relative;
    letter-spacing: 2px;
  }
  nav ul li a:last-child{
    margin-right: 0;
  }
  nav ul li a::before,
  nav ul li a::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: crimson;
    left: 0;
    transform: scaleX(0);
    transition: all .5s;
  }
  nav ul li a::before{
    top: 0;
    transform-origin: left;
  }
  nav ul li a::after{
    bottom: 0;
    transform-origin: right;
  }

  nav ul li a:hover::before,
  nav ul li a:hover::after{
    transform: scaleX(1);
  }

  @keyframes slideIn {
    from{

    }
    to{
      transform: translateX(0);
    }
  }

</style>
