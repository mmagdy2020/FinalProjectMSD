const express = require('express');

const authController = require('../controllers/auth');

const flash = require('flash-express')


const router = express.Router();

const { check, body } = require('express-validator') //all validation logic 



router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin) // bug used get instead of post...

router.post('/logout', authController.postLogOut); //I  should create form instead of link in my navigator as it is post request....



router.get('/signup', authController.getUserSignUP)
router.post('/signup', [check('name', "name should be not empty and not contain number").notEmpty(), check('email').isEmail().withMessage('Please write a valid email..'),
    check('password', 'Password must be more than 4 digit. ').isLength({ min: 5 }),
    body('cpassword').custom((value, { req }) => {
        if (value === req.body.password) {
            return true
        } else {
            throw new Error('password should match the Confirmed password')
        }
    })
], authController.postSignUp);

module.exports = router;