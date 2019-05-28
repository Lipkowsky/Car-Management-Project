<template>
<section class="text-center">
    <div class="card text-white bg-primary mb-3">
        <div class="card-header">Zarządzaj użytkownikami</div>
        <div class="card-body">
            <h4 class="card-title">Poniżej znajdziesz listę swoich użytkowników</h4>
        </div>
    </div>
    <section class="row mt-3" v-bind:key="us._id" v-for="us in usersAndCars">
        <div class="col-12">
            <div class="card border-info mb-3">
                <div class="card-header">
                    <h1>{{us.username}}</h1>
                </div>
                <h4 style="margin-top:10px;">Dostępne samochody</h4>
                <div class="card border-info mb-3" v-bind:key="car._id" v-for="car in us.usersCars">
                    <div class="card-body">
                        <p class="card-text"><span class="carInfo">{{car.vin}}, {{car.name}} , {{car._id}}</span>
                        <button @click="deleteCarRun(us._id, car._id)" class="btn btn-danger float-right">X</button> </p>
                                               
                    </div>
                </div>
                <chooseCarComponent v-bind:us="us"></chooseCarComponent>
            </div>
        </div>
    </section>
</section>
</template>

<script>
import chooseCarComponent from '../components/chooseCarComponent.vue'
const API_URL = 'http://localhost:5000/'
export default {
    components: {
        chooseCarComponent,
    },
    data: () => ({
        user: {},
        users: [],
        usersAndCars: [],
        deleteCar:{
            carsId: '',
            userId: '',
        }
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
                    this.$parent.loggedIn = true;
                    if (this.user.role) {
                        if (this.user.role === 'ADMIN') {
                            this.$parent.isAdmin = true;
                            this.getUsers();
                            //this.getCars();
                            this.getUsersAndCars();
                        }
                    }
                } else {
                    this.$parent.loggedIn = false;
                    this.$parent.isAdmin = false;
                    this.logout();
                }
            });
    },
    methods: {
        logout() {
            if (localStorage.token) {
                this.$parent.isAdmin = false;
                localStorage.removeItem('token');
                this.$router.push('/login');
            }
        },
        getUsers() {
            fetch(`${API_URL}admin/allUsers`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then((users) => {
                    this.users = users;
                });
        },
        getUsersAndCars() {
            fetch(`${API_URL}admin/usersCars`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then((usersAndCars) => {
                    this.usersAndCars = usersAndCars;
                });
        },
        deleteCarRun(userId, carsId){
            this.deleteCar.userId = userId;
            this.deleteCar.carsId = carsId;
            fetch(`${API_URL}admin/deleteUser`, {
                    method: 'POST',
                    body: JSON.stringify(this.deleteCar),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then(car => {
                    this.getUsersAndCars();
                    
                    console.log(car);
                })
        }
    }
}
</script>

<style>
.btn-danger{
   width: 25px;
    height: 25px;
    text-align: center;
    padding: 6px 0;
    font-size: 12px;
    line-height: 1.42;
}
</style>
