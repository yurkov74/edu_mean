const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const user = require("../models/user");

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

router.post("/login",(req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if (!user) return res.status(401).json({
            message: 'Authentication failed: no user with such email!'
        });
        this.fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) return res.status(401).json({
            message: 'Authentication failed: wrong password!'
        });
        const token = jwt.sign({
            email: this.fetchedUser.email, userId: this.fetchedUser._id },
            "a_long_secret_string_for_token_validation",
            { expiresIn: "1h"}
        );
        res.status(200).json({
            token: token
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Authentication failed!',
            error: err
        });
    });
    
});

module.exports = router;