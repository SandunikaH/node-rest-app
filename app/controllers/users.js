const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signUp = (req, res, next) => {
    // user 'User' module from mongoose to check the new email address already exists
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashValue) => {
                if(err) {
                    return res.status(500).json({
                        error:err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hashValue  
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'New user added...'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });    
        }
    })    
}

exports.login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, hashValue) => {
            if(err){
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            if(hashValue) {
                const tokenForUser = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "12h"
                    }   
                );
                return res.status(200).json({
                    message: 'Authentication succeeded',
                    //this token is not encrypted, just encoded
                    token: tokenForUser
                });
            }
            return res.status(401).json({
                message: 'Authentication failed'
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.deleteUser = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}