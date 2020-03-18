// const mongodb = require('mongodb'); // import mongoDb

// const MongoClient = mongodb.MongoClient; // extract mongoClient 


// //testing online Connection...

// const cloudDb = "mongodb+srv://admin:admin@cluster0-xkhvz.mongodb.net/test?onlineShopping=true&w=majority";

// let _db;

// const dbUrl = ('mongodb://localhost:27017') //retryWrites admin....


// const mongoConnect = (cb) => { // expect to get a call back after connecting...
//     //connect to DB. 
//     MongoClient.connect(dbUrl, { useUnifiedTopology: true }) // this will return promise while trying to connect to db  //{ useUnifiedTopology: true }
//         .then(client => {
//             console.log("connected... from DB pages..")
//             _db = client.db('onlineShopping') // connection to my Db, will store here...
//             cb()
//                 // cb(client) // return a call back with client. ?????
//         })
//         .catch(err => {
//             console.log(err)
//         })
// }


// const getDb = () => {
//     if (_db) {
//         return _db
//     } else {
//         throw 'No DB connection found..'
//     }
// }

// exports.mongoConnect = mongoConnect; // exporting the connection
// exports.getDb = getDb; // exporting the the DB after checking the connection..