const express = require('express');

const authController = require('../controllers/auth');

const flash = require('flash-express')


const router = express.Router();

const { check } = require('express-validator') //all validation logic 
    //JS object..
    //only for POST ....


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin) // bug used get instead of post...

router.post('/logout', authController.postLogOut); //I  should create form instead of link in my navigator as it is post request....



router.get('/signup', authController.getUserSignUP)
router.post('/signup', check('email').isEmail(), authController.postSignUp);

module.exports = router;