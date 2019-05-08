<template>
<section class="text-center">
    <h1>Witaj {{user.username}}</h1>
    <div class="card text-white bg-primary mb-3">
        <div class="card-header">Twoje samochody</div>
        <div class="card-body">
            <h4 class="card-title">Poniżej znajdziesz listę swoich</h4>
        </div>
    </div>
    <section class="row mt-3">
        <div class="col-6" v-for="car in cars" :key="car._id">
            <div class="card border-info mb-3">
                <div class="card-header">
                    <h1>{{car.name}}</h1>
                </div>
                <div class="card-body">
                    <p class="card-text"><span class="carInfo">Numer VIN: </span>{{car.vin}}</p>
                    <p class="card-text"><span class="carInfo">Przbieg: </span>{{car.mileage}} km</p>
                </div>
            </div>
        </div>
    </section>
</section>
</template>

<script>
const API_URL = 'http://localhost:5000/'
export default {
    data: () => ({
        user: {},
        cars: [],
    }),
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
                    this.getCars();
                    this.$parent.loggedIn = true;
                } else {
                    this.$parent.loggedIn = false;
                    this.logout();
                }
            });
    },
    methods: {
        logout() {
            if (localStorage.token) {
                localStorage.removeItem('token');
                this.$router.push('/login');
            }
        },
        getCars() {
            fetch(`${API_URL}api/user/mycars`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then((cars) => {
                    this.cars = cars;
                });
        },
    },
};
</script>

<style>
.carInfo{
    color:#000000;
    font-weight:bold;
}
</style>
