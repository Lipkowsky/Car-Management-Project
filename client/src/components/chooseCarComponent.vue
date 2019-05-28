<template>
<div class="card-body">
    <select style="margin-bottom:5px;" v-model="selectedCar">
                    <option v-for="car in cars" v-bind:key="car._id" v-bind:value="{ id: car._id, name: car.name, vin: car.vin }">{{car.vin}}<span>, </span>{{car.name}}<span>, </span>{{car._id}}</option>
                    </select>
    <span> <br>
                    Wybrano: <br>
                    VIN: {{ selectedCar.vin }}
                        <span><br>Marka: </span>
    {{selectedCar.name}}<br></span>
    <span>ID: </span>{{selectedCar.id}}<br>
    <button @click="chooseCar(us._id)" type="submit" class="btn btn-success">Dodaj auto do użytkownika</button>
    <div v-if="errorMessage" class="alert alert-warning" role="alert">
        {{errorMessage}}
    </div>
</div>
</template>

<script>
const API_URL = 'http://localhost:5000/'
export default {
    name: 'chooseCarComponent',
    props: ['us'],
    data: () => ({
        errorMessage: '',
        selectedCar: '',
        cars: [],
        newUserCar: {
            _id: '',
            carsId: '',
        },
        chooseUserForCar: {
            _id: '',
            userId: ''
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
                            this.getCars();
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
        getCars() {
            fetch(`${API_URL}admin/allCars`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then((cars) => {
                    this.cars = cars;
                });
        },
        chooseCar(userId) {
            this.$parent.users.forEach(element => {
                if (element._id === userId) {
                    var tempArr = [];
                    tempArr = element.carsId;
                    if (tempArr.includes(this.selectedCar.id)) {
                        //you can not add because user have this car
                        
                        this.errorMessage = 'Użytkownik już posiada to auto, wybierz inne';
                        return false;
                    } else {
                        //add car
                        this.newUserCar._id = userId;
                        this.newUserCar.carsId = this.selectedCar.id;
                        fetch(`${API_URL}admin/chooseCar`, {
                                method: 'POST',
                                body: JSON.stringify(this.newUserCar),
                                headers: {
                                    'content-type': 'application/json',
                                    authorization: `Bearer ${localStorage.token}`,
                                }
                            }).then(res => res.json())
                            .then(car => {
                                this.chooseUserForCar._id = this.selectedCar.id;
                                this.chooseUserForCar.userId = userId;
                                fetch(`${API_URL}admin/chooseUserForCar`, {
                                        method: 'POST',
                                        body: JSON.stringify(this.chooseUserForCar),
                                        headers: {
                                            'content-type': 'application/json',
                                            authorization: `Bearer ${localStorage.token}`,
                                        }
                                    }).then(res => res.json())
                                    .then(car => {
                                        //this.getUsers();
                                        this.$parent.getUsers();
                                        this.$parent.getUsersAndCars();
                                        this.errorMessage = ''
                                        console.log('Dodano');
                                    })
                            })
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
.alert {
    margin-top: 10px;
}
.btn{
    margin-top:5px;
}
</style>
