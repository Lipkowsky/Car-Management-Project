<template>
<section>
    <div>
        <table class="table table-hover">
            <thead>
                <tr class="table-dark">
                    <th scope="col">Data wyjazdu</th>
                    <th scope="col">Opis podróży</th>
                    <th scope="col">Cel podróży</th>
                    <th scope="col">Kilometry przed</th>
                    <th scope="col">Kilometry po</th>
                    <th scope="col">Przejechane</th>
                </tr>
            </thead>
            <tbody>
                <tr v-bind:key="travel.id" v-for="travel in travels">
                    <td>{{moment(travel.dataOut).format('MMMM Do YYYY')}}</td>
                    <td>{{travel.descriptionTravel}}</td>
                    <td>{{travel.target}}</td>
                    <td>
                        {{travel.killometersBefore}}
                        <span>km</span>
                    </td>
                    <td>
                        {{travel.kilometers}}
                        <span>km</span>
                    </td>
                    <td>
                        {{travel.totalKilometers}}
                        <span>km</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="card border-dark mb-3">
        <div class="card-header">Wybierz okres czasowy dla rekordu</div>
        <div class="card-body">
            <form>
                <div class="form-group">
                    <label for="dataStart">Data początkowa</label>
                    <input v-model="newReport.startDate" type="date" class="form-control" id="dataStart" aria-describedby="dataStart" placeholder="Data początkowa" required>
                    <small id="dataStartHelp" class="form-text text-muted">Podaj datę początkowa</small>
                </div>
                <div class="form-group">
                    <label for="dataEnd">Data końcowa</label>
                    <input v-model="newReport.endDate" type="date" class="form-control" id="dataEnd" aria-describedby="dataEnd" placeholder="Data końcowa" required>
                    <small id="dataEndHelp" class="form-text text-muted">Data końcowa</small>
                </div>
            </form>
        </div>
        <button type="submit" @click="generateReport" class="btn btn-success">Generuj raport</button>
        <div v-if="errorMessage" class="alert alert-warning" role="alert">
            {{errorMessage}}
        </div>
    </div>
    <button v-if="reportReady" type="submit" @click="downloadWithAxios(user.username)" class="btn btn-success">Pobierz raport</button>
    

</section>
</template>

<script>
const API_URL = "http://localhost:5000/";
const axios = require("axios");
const moment = require("moment");
export default {
    data: () => ({
        errorMessage: '',
        user: {},
        travels: [],
        newReport: {
            startDate: '',
            endDate: '',
            number: '',
        },
        reportReady: false
    }),
    mounted() {
        fetch(API_URL, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                }
            })
            .then(res => res.json())
            .then(result => {
                if (result.user) {
                    this.user = result.user;
                    this.getTravels();
                    this.$parent.loggedIn = true;
                    if (this.user.role) {
                        if (this.user.role === "ADMIN") {
                            this.$parent.isAdmin = true;
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
        moment,
        logout() {
            if (localStorage.token) {
                localStorage.removeItem("token");
                this.$router.push("/login");
                this.$parent.isAdmin = false;
            }
        },
        getTravels() {
            fetch(`${API_URL}api/user/myTravels`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    }
                })
                .then(res => res.json())
                .then(travels => {
                    this.travels = travels;
                });
        },
        forceFileDownload(response, username) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', username + '.xlsx')
            document.body.appendChild(link)
            link.click()
        },
        generateReport() {
            const body = {
                startDate: this.newReport.startDate,
                endDate: this.newReport.endDate
            }
            fetch(`${API_URL}api/user/myTravelsByMonth`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${localStorage.token}`,
                    }
                }).then(res => res.json())
                .then(report => {
                    if (report.travelSize === 0) {
                        console.log('Cannot find any travel at this time')
                        this.errorMessage = 'W podanej dacie nie ma żadnych podróży, wybierz inną';
                    } else {
                        this.errorMessage = '';
                        this.reportReady = true;
                        this.newReport.number = report.number;
                        console.log(report.number);
                    }

                })
        },
        downloadWithAxios(username) {
            axios({
                    method: "get",
                    headers: {
                        authorization: `Bearer ${localStorage.token}`
                    },
                    url: 'http://localhost:5000/api/user/5cd7004459adfc2d68b649dd/report/' + this.newReport.number,
                    responseType: "arraybuffer"
                })
                .then(response => {
                    this.forceFileDownload(response, username);
                    this.reportReady = false;
                })
                .catch((err) => console.log("error occured"));
        }
    }
};
</script>

<style>
</style>
