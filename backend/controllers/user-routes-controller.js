const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.userCreate = (req, res, next) => {
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
};

exports.userLogin = (req, res, next) => { //console.log('req.body:', req.body);
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {console.log('user from db:', user);
        if (!user) return res.status(401).json({
            message: 'Authentication failed: no user with such email!'
        });
        this.fetchedUser = user; console.log('fetchedUser:', this.fetchedUser);
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {//console.log('password is correct:', result);
        if (!result) return res.status(401).json({
            message: 'Authentication failed: wrong password!'
        });
        const tokenTtlInHours = 1;
        const token = jwt.sign({
            email: this.fetchedUser.email, userId: this.fetchedUser._id },
            "a_long_secret_string_for_token_validation",
            { expiresIn: tokenTtlInHours + "h"}
        );
        res.status(200).json({
            token: token,
            expiresIn: tokenTtlInHours * 60 * 60,
            userId: this.fetchedUser._id
        });
    })
    .catch(err => { //console.log(err.message); onsole.log(err);
        return res.status(401).json({
            message: 'Authentication failed!',
            error: err
        });
    });
}