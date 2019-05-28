<template>
<div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link class="nav-link" to="/">Strona główna</router-link>
        <button @click="toogleActive" v-bind:class="{ 'navbar-toggler show': isActive, 'navbar-toggler': isNoActive }" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="true" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
        </button>
        <div v-bind:class="{ 'navbar-collapse collapse show': isActive, 'navbar-collapse collapse': isNoActive }" id="navbarColor03" style="">
            <ul class="navbar-nav mr-auto">
                <li v-if="!loggedIn" class="nav-item active">
                    <router-link class="nav-link" to="signup">Rejestracja</router-link>
                </li>
                <li v-if="!loggedIn" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="login">Logowanie</router-link>
                </li>
                <li v-if="loggedIn" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="dashboard">Wybór samochodu</router-link>
                </li>
                <li v-if="loggedIn" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="myTravels">Moje podróże</router-link>
                </li>
                <li v-if="isAdmin" class="navbar-nav mr-auto">
                    <router-link class="nav-link" to="Admin">Admin panel</router-link>
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
            isAdmin: false,
            user: {},
            isActive: false,
            isNoActive: true
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
                    if (this.user.role) {
                        if (this.user.role === 'ADMIN') {
                            this.isAdmin = true;
                        }
                    }
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
                this.isAdmin = false;
            }
        },
        toogleActive() {
            this.isActive = !this.isActive;
        }
    },
}
</script>

<style>
@media screen and (max-width: 1024px) {

    .nav-link {
            padding: 0px;
    }
}
</style>
