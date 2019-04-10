var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
const dotenv = require('dotenv');
require('dotenv').config();

var port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));


const mongoURI = process.env.DB_HOST;


mongoose.connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log("Connection is correct"))
    .catch(err => console.log(err));

var Users = require("./routes/Users");

app.use("/users", Users);

app.listen(port, function () {
   console.log("Server is running: " + port);
});

