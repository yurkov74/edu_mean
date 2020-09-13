const express = require("express");

const userController = require("../controllers/user-routes-controller");

const router = express.Router();

router.post("/signup", userController.userCreate );

router.post("/login", userController.userLogin );

module.exports = router;