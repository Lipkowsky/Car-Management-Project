const express = require('express');
const router = express.Router();
var ObjectID = require('mongodb').ObjectID;


const client = require('../db/connection');


router.get('/account', async (req, res) => {
    res.json({
        message: "You are an admin - great"
    });
});


router.get('/allUsers', async (req, res) => {
    var db = await client.connectionHandler();

    db.db('Project').collection('Authentication').find({}).toArray().then(users => {
        res.json(users);
        db.close();
    })
});


router.get('/allCars', async (req, res) => {
    var db = await client.connectionHandler();

    db.db('Project').collection('Cars').find({}).toArray().then(cars => {
        res.json(cars);
        db.close();
    })
});


router.get('/usersCars', async (req, res) => {
    var db = await client.connectionHandler();


    db.db('Project').collection('Authentication')
        .aggregate([{
            $lookup:
            {
                from: "Cars",
                localField: "carsId",
                foreignField: "carId",
                as: 'usersCars'
            }
        }]).toArray().then(userCars => {
            res.json(userCars);
            db.close();
        })
});


router.post('/deleteUser', async (req, res, next) => {
    var db = await client.connectionHandler();

        var userCars = {
            carsId:req.body.carsId,
        }

        var carsInAuth = {
            userId:req.body.userId,
        }
    
        var carsId = req.body.carsId;
        var userId =  req.body.userId;

    db.db('Project').collection('Authentication')
        .update({ '_id': ObjectID(userId) }, { $pull: userCars }, function (err, result) {
            console.log('Delete car from array');
            db.close();

        })

    db.db('Project').collection('Cars')
        .update({ '_id': ObjectID(carsId) }, { $pull: carsInAuth }, function (err, result) {
            console.log('Delete user from array');
            db.close();
        })
    res.json('Delete Car');
});




router.post('/chooseCar', async (req, res, next) => {
    var db = await client.connectionHandler();
    var userCars = {
        carsId: req.body.carsId,
    };
    var _id = req.body._id;

    db.db('Project').collection('Authentication')
        .updateOne({ '_id': ObjectID(_id) }, { $push: userCars }, function (err, result) {
            console.log('Update userCars');
            db.close();
        })
    res.json('update Car');
});



router.post('/chooseUserForCar', async (req, res, next) => {
    var db = await client.connectionHandler();
    var userCars = {
        userId: req.body.userId,
    };
    var _id = req.body._id;

    db.db('Project').collection('Cars')
        .updateOne({ '_id': ObjectID(_id) }, { $push: userCars }, function (err, result) {
            console.log('Update userCars');
            db.close();
        })
    res.json('update Car for User');
});


module.exports = router;