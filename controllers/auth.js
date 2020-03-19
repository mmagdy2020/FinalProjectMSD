const Product = require('../models/user');

const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')



const flash = require('connect-flash')


exports.getLogin = (req, res, next) => {
    // res.session.isl
    res.render('userLogin', { errorMessage: req.flash('loginErr'), 'pageTitle': 'User Login' })
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
                            req.flash('loginErr', 'Invalid Username or Password!');
                            console.log("wrong User&Pass")
                            res.redirect('/login');
                        }
                    });
            } else {

                req.flash('loginErr', 'Invalid Username or Password!');
                console.log("wrong User&Pass")

                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
        });

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
    res.render('signup', { signupMessage: 'signupMessage', 'pageTitle': 'SignUp Page' })
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
        return res.status(422).render('signup', { signupMessage: errors.array(), 'pageTitle': 'SignUp Page' })
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