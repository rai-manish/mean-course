const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js')

module.exports = router;



// create the new user

router.post("/signup", userController.createUser);

// login the user
router.post('/login', userController.userLogin)