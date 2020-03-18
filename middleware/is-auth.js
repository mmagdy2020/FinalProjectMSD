module.exports = (req, res, next) => {

    // console.log(res.locals.isAuthenticated)
    if (!req.session.isLoggedIn) {

        return res.redirect('/login')
    }
    next()
}



// How it is work. 

/*

1- in App.js, Assign res.locals.isAuthenticated = req.session.isLoggedIn inside a app.use, as it will have a value of true/false
for the is isAuthenticated on our local session. 

2- when post login, if login Successfully, so req.session.isLoggedIn = true...

3- create a middle to handel this instead of adding a variable for every route 

4- add is auth to the routes that you wish to protect :) . 

5- in HTMl add if  authenticated/ not  .  because we created local authenicated variable already...





*/