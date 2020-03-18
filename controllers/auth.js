const Product = require('../models/user');

const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')



// const flash = require('connect-flash')



exports.getLogin = (req, res, next) => {
    // res.session.isl
    res.render('userLogin', { errorMessage: req.flash('loginErr') })
};


exports.postLogin = (req, res, next) => {
    // /with Post 

    const email = req.body.email;
    const password = req.body.password
        // need to work on it again ....... 

    User.findOne({ email: email }) // copied from the teacher .
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            console.log("user Signed OK....")
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                console.log("let's redirect him...")
                                res.redirect('/');
                            })
                        } else {
                            req.flash('loginErr', 'Invalid Username and Password!');
                            console.log("wrong User&Pass")
                            res.redirect('/login');
                        }
                    });
            } else {

                // req.flash('loginErr', 'Invalid Username and Password!');
                console.log("wrong User&Pass")

                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
        });


    // User.findOne({ email: email })
    //     .then(user => {
    //         if (!user) {
    //             console.log("can't find the user...")
    //             return res.redirect('/login')
    //         }

    //         // need to understand more specially Async...

    //         bcrypt.compare(password, user.password) //this will return a promise and it will compare the password with what I have in the DB...
    //             .then(result => {
    //                 if (result) { // here we will set all of the session as the use will logged in successfully.. 
    //                     console.log("User logged in with valid Email and Pass")
    //                     req.session.isLoggedIn = true // this will create a session cookie named connect.io...
    //                     res.session.user = user // very Important.......
    //                     return res.session.save(err => {
    //                         console.log(err)
    //                         res.redirect('/')
    //                     })
    //                 } else {
    //                     res.redirect('/login')

    //                 }

    //             })

    //     })



}

exports.postLogOut = (req, res, next) => {
    console.log(console.session)
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')

    })
}

exports.getUserSignUP = (req, res, next) => {

    console.log("user will signup Up...")
    res.render('signup', { signupMessage: 'signupMessage' })
};


exports.postSignUp = (req, res, next) => {

    console.log(req.body)

    const name = req.body.name
    const password = req.body.password
    const email = req.body.email
        // const cPassword = req.body.cPassword
    const isAdmin = false;
    const errors = validationResult(req)

    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(422).render('signup', { signupMessage: errors.array() })
    }

    User.findOne({ email: email })
        .then(userDoc => { //bug I used user as document and didn't change my original user variable/
            if (userDoc) {
                // console.log("User is already Exist...")
                return res.redirect('/signup')
            } // mean if this user is exist... 
            //else.... 
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        password: hashedPassword,
                        email: email,
                        isAdmin: isAdmin,
                        cart: {
                            items: []
                        }
                    })
                    return user.save()
                }).catch(err => console.log(err))

        })

    res.redirect('/login')

};