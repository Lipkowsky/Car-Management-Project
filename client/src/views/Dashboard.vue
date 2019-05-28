<template>
<section class="text-center">
    <h1>Witaj {{user.name}} {{user.surname}}</h1>
    <div class="card text-white bg-primary mb-3">
        <div class="card-header">Twoje samochody</div>
        <div class="card-body">
            <h4 class="card-title">Poniżej znajdziesz listę swoich</h4>
        </div>
    </div>
    <section class="row mt-3">
        <div class="col-6" v-bind:key="car.id" v-for="car in cars">
            <div class="card border-info mb-3">
                <div class="card-header">
                    <h1>{{car.name}}</h1>
                </div>
                <div class="card-body">
                    <p class="card-text"><span class="carInfo">Numer VIN: </span>{{car.vin}}</p>
                    <p class="card-text"><span class="carInfo">Przbieg: </span>{{car.mileage}} km</p>
                    <travelComponent v-bind:car="car"></travelComponent>
                </div>
                
            </div>
        </div>
    </section>
</section>
</template>

<script>
import travelComponent from '../components/travelComponent.vue'


const API_URL = 'http://localhost:5000/'
export default {
    components: {
    travelComponent,
  },
    data: () => ({
        user: {},
        cars: [],
        newTravel: {
            dataOut: '',
            descriptionTravel: '',
            target: '',
            kilometers: 0,
            carId: '',
        },
        newUpdateCar: {
            mileage: '',
            _id: '',
        },
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
                    if (this.user.role) {
                        if (this.user.role === 'ADMIN') {
                            this.$parent.isAdmin = true;
                        }
                    }
                } else {
                    this.$parent.loggedIn = false;
                    this.$parent.isAdmin = true;
                    this.logout();
                }
            });
    },
    methods: {
        logout() {
            if (localStorage.token) {
                localStorage.removeItem('token');
                this.$router.push('/login');
                this.$parent.isAdmin = false;
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
        addTravel(carId) {
            this.newTravel.kilometers = parseInt(this.newTravel.kilometers);
            this.newTravel.carId = carId;
            fetch(`${API_URL}api/user/newTravel`, {
                    method: 'POST',
                    body: JSON.stringify(this.newTravel),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then(travel => {
                    console.log(travel);
                })

            this.newUpdateCar._id = carId;

            var i = 0;
            var tempMileage = 0;
            for(i in this.cars){
                if(this.cars[i]._id === carId){
                    tempMileage = this.cars[i].mileage;
                }
            }

            this.newUpdateCar.mileage = parseInt(tempMileage) - parseInt(this.newTravel.kilometers);
            fetch(`${API_URL}api/user/updateCar`, {
                    method: 'POST',
                    body: JSON.stringify(this.newUpdateCar),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then(car => {
                    this.getCars();
                })
        },

    },
};
</script>

<style>
.carInfo {
    color: #000000;
    font-weight: bold;
}
</style>
