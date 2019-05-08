const express = require('express');
const router = express.Router();


const client = require('../db/connection'); 


//get information about your account
router.get('/user/account', async (req, res) => {
    var db = await client.connectionHandler();
    
    db.collection('Authentication').find({
        username: req.user.username
    }).toArray().then(user =>{
        res.json(user);
    })
});

//get information about your account
router.get('/user/mycars', async (req, res) => {
    var db = await client.connectionHandler();
    
    db.collection('Cars').find({
        userId: req.user._id
    }).toArray().then(cars =>{
        res.json(cars);
    })
});


  





module.exports = router;