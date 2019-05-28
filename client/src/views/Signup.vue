<template>
<section>
    <div class="card text-white bg-dark mb-3">
        <div class="card-header">Rejestracja</div>
        <div class="card-body">
            <h3 class="card-title">Skorzystaj z naszego formularza aby się zarejestrować</h3>
        </div>
    </div>
    <form @submit.prevent="signup">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
        </div>
        <div class="form-group">
            <label for="name">Imię</label>
            <input
            v-model="user.name"
            type="text"
            class="form-control"
            id="name"
            aria-describedby="nameHelp" placeholder="Imię" required>
        </div>
        <div class="form-group">
            <label for="surname">Nazwisko</label>
            <input
            v-model="user.surname"
            type="text"
            class="form-control"
            id="surname"
            aria-describedby="surnameHelp" placeholder="Nazwisko" required>
        </div>
        <div class="form-group">
            <label for="username">Nazwa użytkownika</label>
            <input
            v-model="user.username"
            type="text"
            class="form-control"
            id="username"
            aria-describedby="usernameHelp" placeholder="Nazwa użytkownika" required>
            <h5 id="usernameHelp" class="form-text text-muted">Username must be at least two characters and shorter than 30</h5>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="password">Hasło</label>
                <input
                v-model="user.password"
                type="password"
            class="form-control"
            id="password"
            aria-describedby="passwordHelp"
            placeholder="Hasło" required>
        </div>
                <div class="form-group col-md-6">
                    <label for="confirmPassword">Powtórz hasło</label>
                    <input
                    v-model="user.confirmPassword"
                    type="password"
            class="form-control"
            id="confirmPassword"
            aria-describedby="confirmPasswordHelp"
            placeholder="Powtórz hasło" required>
        </div>
                </div>
                <button type="submit" class="btn btn-primary">Zarejestruj się</button>
    </form>
</section>
</template>

<script>
const Joi = require('joi');

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    name: Joi.string().regex(/^[A-Za-z]+$/).min(2).max(30).required(),
    surname: Joi.string().regex(/^[A-Za-z]+$/).min(2).max(30).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required()
});

export default {
    data: () => ({
        errorMessage: '',
        user: {
            username: '',
            password: '',
            name: '',
            surname: '',
            confirmPassword: '',
        },
    }),
    watch: {
        user: {
            handler() {
                this.errorMessage = '';
            },
            deep: true,
        },
    },
    methods: {
        signup() {
            this.errorMessage = '';
            if (this.validUser()) {
                //send data to server
                const body = {
                    username: this.user.username,
                    password: this.user.password,
                    name: this.user.name,
                    surname: this.user.surname,
                };
                this.signingUp = true;
                fetch(SIGNUP_URL, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'content-type': 'application/json'
                    },
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }

                    return response.json().then((error) => {
                        throw new Error(error.message);
                    });

                }).then((result) => {
                    localStorage.token = result.token;
                    setTimeout(() => {
                        this.signingUp = false;
                        this.$router.push('login');
                    }, 1000);
                }).catch((error) => {
                    setTimeout(() => {
                        this.signingUp = false;
                        this.errorMessage = error.message;
                    }, 1000);
                });
            }
        },
        validUser() {
            if (this.user.password !== this.user.confirmPassword) {
                this.errorMessage = 'Password must match';
                return false;
            }

            const result = Joi.validate(this.user, schema);
            if (result.error === null) {
                return true;
            }
            console.log(result.error);
            if (result.error.message.includes('username')) {
                this.errorMessage = 'Nazwa użytkownika jest niewłaściwa';
            }
            if (result.error.message.includes('name')) {
                this.errorMessage = 'Imię jest niewłaściwe';
            } 
            if (result.error.message.includes('surname')) {
                this.errorMessage = 'Nazwisko jest niewłaściwe';
            }  
            else{
                this.errorMessage = 'Hasło jest niewłaściwe';
            }
            return false;
        },
    }
}
//class="card text-white bg-dark mb-3"
</script>

<style>

</style>
