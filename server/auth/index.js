const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const client = require('../db/connection');

require('dotenv').config();


const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    name: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    surname: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().min(6).required(),
});

const schemaLogin = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().min(6).required(),
});


function respondError422(res, next) {
    res.status(422);
    const error = new Error('Unable to login');
    next(error);
}


function createTokenSendResponse(user, res, next) {
    const payload = {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        role: user.role
    };
    jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) {
            respondError422(res, next);
        } else {
            res.json({ token });
        }
    });
};


router.post('/signup', async (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        var users = await client.connectionHandler();
        users = users.db('Project').collection('Authentication');
        users.findOne({
            username: req.body.username
        }).then(user => {
            if (user) {
                //there is already a user in db
                //respond with error
                const error = new Error('User already exists');
                res.status(409);
                next(error);
            } else {
                //hash the password
                //insert to mongodb
                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword,
                        name: req.body.name,
                        surname: req.body.surname,
                        carsId: [],
                        role: ''
                    };



                    users.insertOne(newUser).then(insrtedUser => {
                        res.json(insrtedUser);
                        createTokenSendResponse(insrtedUser, res, next);
                    });
                });
            }
        });
    } else {
        res.status(422);
        next(result, error);
    }
});


router.post('/login', async (req, res, next) => {
    var users = await client.connectionHandler();
    users = users.db('Project').collection('Authentication');
    const result = Joi.validate(req.body, schemaLogin);
    console.log(result);
    if (result.error === null) {
        users.findOne({
            username: req.body.username
        }).then(user => {
            if (user) {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((result) => {
                        if (result) {
                            console.log(user);
                            //they sent us the right password
                            createTokenSendResponse(user, res, next);
                        } else {
                            respondError422(res, next);
                        }
                    });
            } else {
                respondError422(res, next);
            }
        });
    } else {
        respondError422(res, next);
    }
});



module.exports = router;