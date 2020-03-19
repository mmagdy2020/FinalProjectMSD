const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path');
// const cookieParser = require('cookie-parser') // for Cookie

const bcrypt = require('bcryptjs') // to encrypt the passwords..
    // const flash = require('flash-express')  //not working with me..
const flash = require('connect-flash')

const session = require('express-session') // for session..
const MongoDBStore = require('connect-mongodb-session')(session) // session is from Session from Express..
const User = require('./models/user')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const autRoutes = require('./routes/auth')
    // const expressValidator = require('express-validator')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + file.originalname)
    }
})

//mongoConnect is the one that we imported...


const app = express();


// const mongoCLoud_url = `mongodb+srv://admin:admin@onlineshoppingcluster-tw6tj.gcp.mongodb.net/onlineShopping?retryWrites=true&w=majority`
// const mongoCLoud_url = `mongodb+srv://admin:admin@onlineshoppingcluster-tw6tj.gcp.mongodb.net/onlineShopping?retryWrites=true&w=majority`


const store = new MongoDBStore({ // where I have to store my Data...
    uri: process.env.mongoCLoud_url, // the URL for my DB  Bug: Uri instead of url
    collection: 'dbSession' // will create a new Collection 

})

// file Storage, take an object which have the finalDestination and fileName..

app.set('view engine', 'ejs'); // Step 1

app.use('/images', express.static(path.join(__dirname, 'images'))) // for File uploaded..

app.use('/mycss', express.static(path.join(__dirname, 'public', 'css')));
// app.use('/img', express.static(path.join(__dirname, 'public', 'images')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// store should go throw this
app.use(session({ secret: 'MySecret', resave: false, saveUninitialized: false, store: store })) //for session 2
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ storage: fileStorage }).single('image')) // as I have image at my application.... // name should be image

app.use(flash())

// app.use(cookieParser) //where should I add it...


// app.use('/', (req, res, next) => {
//     console.log('This always run');
//     next();
// });


// I have Bug here, workAround, stop the below function, create a new user, then open it...
// the bug happen when I logout and destory session..

//it is worked now but when signout, cart will not work properly. 
app.use((req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        User.findById(req.session.user._id) // bug , eachTime you drop your Collection, this should be replaced..
            .then(user => {
                req.user = user // we can call this at any point in the application...
                next()
            })
            .catch(err => console.log(err))
    }
})



app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; //  req.session.isLoggedIn has to set to true when POStlogin
    if (req.session.isLoggedIn) { // Global variable
        res.locals.isAdmin = req.session.user.isAdmin
    }

    // res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(autRoutes)


app.use((req, res, next) => {
    if (res.status(404)) {
        res.render('404')
            // res.render('404', { 'pageTitle': 'Error Page...' })

    }
});

// app.use(function(err, req, res, next) {
//     res.status(500).send('Something broke!');
// });



// mongoConnect(() => {
//     console.log("Connected from app.js ...")
//     app.listen(3000)
// })


mongoose.connect(process.env.mongoCLoud_url, { useNewUrlParser: true, useUnifiedTopology: true })

.then(() => {

    app.listen(process.env.PORT || 3000)

}).catch(err => console.log(err))