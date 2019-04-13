<template>
  <div class="container">
    <div class="row">
      <div class="col-md-10 offset=md-1">
      <div class="row">
        <div class="col-md-5 register-left">
          <img :src="require('../assets/racing.png')" alt="image made by Pixel Buddha - race flag icon"/>
           <h3>Car Management Project</h3>
           <p>Lore Ipsum</p>
            <button type="button" class="btn btn-primary">Poznaj naszą aplikację</button>
        </div>
        <div class="col-md-7 register-right">
            <h2>Zarejestruj się teraz !</h2>
            <div class="div register-form">
              <form v-on:submit.prevent="register">
                <div class="form-group">
                  <label for="first_name">Imię</label>
                  <input type="text" v-model="first_name" class="form-control" name="first_name" placeholder="Podaj imię">
                </div>
                <div class="form-group">
                  <label for="last_name">Nazwisko</label>
                  <input type="text" v-model="last_name" class="form-control" name="last_name" placeholder="Podaj nazwisko">
                </div>
                <div class="form-group">
                  <label for="email">Adres Email</label>
                  <input type="email" v-model="email" class="form-control" name="email" placeholder="Podaj Email">
                </div>
                <div class="form-group">
                  <label for="password">Hasło</label>
                  <input type="password" v-model="password" class="form-control" name="password" placeholder="Podaj hasło">
                </div>
                <button class="btn btn-primary" type="submit">Zarejestruj</button>
              </form>
            </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import router from '../router'

  export default {
    data () {
      return {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      }
    },

    methods: {
      register () {
        axios.post('users/register', {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password
        }).then(res => {
          if(res.data.error === 'User already exists'){
            router.push({name: 'Register'})
            console.log(res.data);
          }else {
            router.push({name: 'Login'})
            console.log("Poprawna rejestracja")
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped>
.container{
  margin-top: 150px !important;
}
  .register-left{
    text-align: center;
    color: #fff;
    padding: 30px;
  }
  .register-left p{
    padding: 20px 20px 0;
  }
  .register-left img{
    margin-top: 60px;
    margin-bottom: 18px;
    width: 100px;
    animation: mover 0.65s infinite alternate;
  }

  .register-left .btn-primary{
    border-radius: 1.5rem;
    border:none;
    width:120px;
    background: #f8f8f8;
    font-weight: 600;
    color: #555;
    margin-top:20px;
    padding: 10px;
  }
.register-left .btn-primary:hover{
  background: #000;
}
  .register-right{
    border: none;
    background-image: linear-gradient(to right, #2e007f, #5c00ff);
    border-top-left-radius: 10% 50%;
    border-bottom-left-radius: 10% 50%;
    padding: 50px;
  }
  .register-right h2{
    text-align: center;
    margin-bottom: 10px;
    color: #fff
  }
  .register-form{
    padding: 30px;
    color: #fff;
  }
.register-right .btn-primary{
    float:right;
    border-radius: 1.5rem;
    border:none;
    width:120px;
    background: #5c00ff;
    font-weight: 600;
    color: #fff;
    margin-top:20px;
    padding: 10px;
}
.register-right .btn-primary:hover{
  background: #2e007f;
}
  @keyframes mover{
    0%{
      transform: translateX(5px);
    }

    100%{
      transform: translateX(-5px);
    }
  }

</style>
