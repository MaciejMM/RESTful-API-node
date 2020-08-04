const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const process = require('../../nodemon.json');
const User = require("../models/user");


exports.signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "[Error] Email exist. Please use different one...",
                });
            } else {
                bcrypt.hash(req.body.password, 15, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        });
                        user
                            .save()
                            .then((result) => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created.",
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                });
                            });
                    }
                });
            }
        });
}

exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: "Auth Failed"
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {

                    const token = jwt.sign({
                        email: user.email,
                        userId: user.userId
                    }, 
                    process.env.JWT_KEY, 
                    {expiresIn:"1h"},

                    )
                    return res.status(200).json({
                        message: "Auth successful",
                        token:token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });

            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}