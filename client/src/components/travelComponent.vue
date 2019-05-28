<template>
<form @submit.prevent="addTravel(car._id, car.mileage)">
    <div class="form-group">
        <label for="dataOut">Data podróży</label>
        <input v-model="newTravel.dataOut" type="date" class="form-control" id="dataOut" aria-describedby="dataOutHelp" placeholder="Data wyjazdu" required>
        <small id="dataOutHelp" class="form-text text-muted">Podaj datę wyjazdu</small>
    </div>
    <div class="form-group">
        <label for="descriptionTravel">Opis podróży</label>
        <input v-model="newTravel.descriptionTravel" type="text" class="form-control" id="descriptionTravel" aria-describedby="descriptionTravelHelp" placeholder="Opis podróży" required>
        <small id="descriptionTravelHelp" class="form-text text-muted">Podaj opis podróży</small>
    </div>
    <div class="form-group">
        <label for="target">Cel podróży</label>
        <input v-model="newTravel.target" type="text" class="form-control" id="target" aria-describedby="targetHelp" placeholder="Cel podróży" required>
        <small id="targetHelp" class="form-text text-muted">Podaj cel podróży</small>
    </div>
    <div class="form-group">
        <label for="kilometers">Stan licznika po podróży</label>
        <input v-model="newTravel.kilometers" type="number" :min="[car.mileage]" class="form-control" id="kilometers" placeholder="Podaj stan licznika w km" aria-describedby="kilometersHelp"  required>
        <small id="kilometersHelp" class="form-text text-muted">Podaj stan licznika po podróży</small>
    </div>
    <button type="submit" class="btn btn-success">Dodaj podróż</button>
</form>
</template>

<script>
const API_URL = 'http://localhost:5000/'
export default {
    name: 'travelComponent',
    props: ['car'],
    cars: [],
    data: () => ({
        user: {},
        newTravel: {
            dataOut: '',
            descriptionTravel: '',
            target: '',
            killometersBefore: 0,
            kilometers: 0,
            carId: '',
            totalKilometers: 0,
            name: '',
            surname: '',
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
                    this.$parent.getCars();
                    this.$parent.loggedIn = true;
                    this.newTravel.name = this.user.name;
                    this.newTravel.surname = this.user.surname;
                } else {
                    this.$parent.loggedIn = false;
                    this.logout();
                }
            });

    },
    methods: {
        addTravel(carId, choosenCarMileage) {
            this.newTravel.killometersBefore = parseInt(choosenCarMileage);
            this.newTravel.kilometers = parseInt(this.newTravel.kilometers);
            this.newTravel.carId = carId;
            this.newTravel.totalKilometers = (parseInt(this.newTravel.kilometers) - parseInt(choosenCarMileage));
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

            this.newUpdateCar.mileage = parseInt(this.newTravel.kilometers);
            fetch(`${API_URL}api/user/updateCar`, {
                    method: 'POST',
                    body: JSON.stringify(this.newUpdateCar),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then(car => {
                    this.$parent.getCars();
                })
        },

    },
};
</script>

<style>

</style>
