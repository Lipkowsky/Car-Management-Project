<template>
<section>
    <div class="card text-white bg-dark mb-3">
        <div class="card-header">Logowanie</div>
        <div class="card-body">
            <h3 class="card-title">Podaj swoje dane aby się zalogować</h3>
        </div>
    </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
        </div>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="userName">Nazwa użytkownika</label>
                <input
            v-model="user.username"
            type="text"
            class="form-control"
            id="username"
            aria-describedby="usernameHelp" placeholder="Nazwa użytkownika" required>
                <h5 id="usernameHelp" class="form-text text-muted">Podaj login</h5>
            </div>
            <div class="form-group">
                <label for="password">Hasło</label>
                <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            aria-describedby="passwordHelp" placeholder="Hasło" required>
                <h5 id="passwordHelp" class="form-text text-muted">Podaj hasło</h5>
            </div>
            <button type="submit" class="btn btn-primary">Zaloguj się</button>
        </form>
</section>
</template>

<script>
const Joi = require('joi');

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().min(6).required()
});

export default {
    data: () => ({
        errorMessage: '',
        user: {
            username: '',
            password: '',
        }
    }),
    methods: {
        login() {
            this.errorMessage = '';
            if (this.validUser()) {
                const body = {
                    username: this.user.username,
                    password: this.user.password
                };
                fetch(LOGIN_URL, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(body),
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    return response.json().then((error) => {
                        throw new Error(error.message);
                    });

                }).then((result) => {
                    //its worked the entered valid info
                    //they are logged in now
                    console.log(result);
                    localStorage.token = result.token;
                    setTimeout(() => {
                        this.$router.push('dashboard');
                    }, 1000);
                }).catch((error) => {
                    setTimeout(() => {
                        
                        this.errorMessage = error.message;
                    }, 1000);
                });
            }
        },
        validUser() {
            const result = Joi.validate(this.user, schema);
            if (result.error === null) {
                return true;
            }
            if (result.error.message.includes('username')) {
                this.errorMessage = 'Username is invalid';
            } else {
                this.errorMessage = 'Password is invalid';
            }
            return false;
        }
    },
}
</script>

<style>

</style>
