const mongoose = require('mongoose')

const Schema = mongoose.Schema



const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        // data: buffer,
        // contentType: String,
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    userId: { //save only the user ID...
        type: Schema.Types.ObjectId,
        ref: 'User', // will referring to User Model as well.... 
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)