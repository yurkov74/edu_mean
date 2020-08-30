const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        console.log('Tryin to create user...', user);
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        })
        .catch(err =>{
            res.status(500).json({
                message: "Error creating new user!",
                error: err
            })
        });
    });
});

router.post("/login");

module.exports = router;