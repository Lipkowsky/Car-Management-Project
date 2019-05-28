const express = require('express');
const router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var json2xls = require('json2xls');
const uuidv1 = require('uuid/v1');


const client = require('../db/connection');



//get information about your account
router.get('/user/account', async (req, res) => {
    var db = await client.connectionHandler();

    db.db('Project').collection('Authentication').find({
        username: req.user.username
    }).toArray().then(user => {
        res.json(user);
        db.close();
    })
});

//get information about your account
router.get('/user/mycars', async (req, res) => {
    var db = await client.connectionHandler();

    db.db('Project').collection('Cars').find({
        userId: req.user._id
    }).toArray().then(cars => {
        res.json(cars);
        db.close();
    })
});


router.post('/user/newTravel', async (req, res, next) => {
    var db = await client.connectionHandler();
    const travel = {
        dataOut: new Date(req.body.dataOut),
        descriptionTravel: req.body.descriptionTravel,
        target: req.body.target,
        killometersBefore: req.body.killometersBefore,
        kilometers: req.body.kilometers,
        carId: req.body.carId,
        totalKilometers: req.body.totalKilometers,
        name: req.body.name,
        surname: req.body.surname,
        userId: req.user._id,
    };
    db.db('Project').collection('Travels')
        .insertOne(travel)
        .then(travel => {
            res.json(travel);
            db.close();
        })
});

router.post('/user/updateCar', async (req, res, next) => {
    var db = await client.connectionHandler();
    var car = {
        mileage: req.body.mileage,
    };
    var _id = req.body._id;

    db.db('Project').collection('Cars')
        .updateOne({ '_id': ObjectID(_id) }, { $set: car }, function (err, result) {
            console.log('Update mileage car');
            db.close();
        })
    res.json('update');
});

router.get('/user/myTravels', async (req, res) => {
    var db = await client.connectionHandler();

    db.db('Project').collection('Travels').find({
        userId: req.user._id
    }).toArray().then(cars => {
        res.json(cars);
        db.close();
    })
});


router.post('/user/myTravelsByMonth', async (req, res) => {
    var db = await client.connectionHandler();
    var urlExtraNumber = uuidv1();
    db.db('Project').collection('Travels')
        .find({
            userId: req.user._id,
            dataOut: { "$gte": new Date(req.user.startDate), "$lt": new Date(req.body.endDate) }
        })
        .toArray().then(travel => {
            router.use(json2xls.middleware);
            travelSize = travel.length;
            res.json({
                number: urlExtraNumber,
                travelSize: travelSize,
            });
            router.get('/user/5cd7004459adfc2d68b649dd/report/'+urlExtraNumber,function(req, res) {
                  res.xls('data.xlsx', travel);
                  
                });
                i+=1;
            db.close();
        });
});


















module.exports = router;