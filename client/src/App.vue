<template>
<div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link class="navbar-brand" to="home"> Car Management Project</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
        <div class="collapse navbar-collapse" id="navbarColor03">
            <ul class="navbar-nav mr-auto">
                <li v-if="!loggedIn" class="nav-item active">
                    <router-link class="nav-link" to="signup">Rejestracja</router-link>
                </li>
                <li v-if="!loggedIn" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="login">Logowanie</router-link>
                </li>
                <li v-if="loggedIn" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="dashboard">Panel główny</router-link>
                </li>
            </ul>
            <div v-if="loggedIn" class="form-inline my-2 my-lg-0">
                <button class="btn btn-secondary my-2 my-sm-0" @click="logout">Wyloguj</button>
            </div>
        </div>
    </nav>
    <router-view class="container pt-2" />
</div>
</template>

<script>
const API_URL = 'http://localhost:5000/'
export default {
    data() {
        return {
            loggedIn: false,
            user: {},
        }
    },
    mounted() {
        fetch(API_URL, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`,
                },
            })
            .then(res => res.json())
            .then((result) => {
                if (result.user) {
                    this.user = result.user;
                    this.loggedIn = true;
                }
            });
    },
    methods: {
        logout() {
            if (localStorage.token) {
                localStorage.removeItem('token');
                this.$router.push('/login');
                this.loggedIn = false;
            }
        },
    },
}
</script>

<style>

</style>
