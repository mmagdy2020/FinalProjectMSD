const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: { // so I can differentiate between admin and user.
        type: Boolean,
        required: true
    },
    cart: { // Cart => items[{productID : 23123123, qty: 1 },{},{},{}]
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // will refer to the Product. One to One relationship...
            qty: { type: Number, required: true }
        }]
    }

})


userSchema.methods.addToCart = function(product) { // didn't work as arrow function...

    // myOwn Logic...


    // getting the index for the Product which will be added. will -1 if not exist. and will be the index if exist..


    const cartProdIndex = this.cart.items.findIndex(cartProd => {
        return cartProd.productId.toString() === product._id.toString()
    })

    let newQty = 1; // will increase the qty by one either the 2 ways. 
    const updatedCartItems = [...this.cart.items] // assign everything in the cart.items to this variable. 

    if (cartProdIndex >= 0) {
        // newQty = this.cart.items[cartProdIndex].qty + 1 // or +1
        // updatedCartItems[cartProdIndex].qty = newQty

        this.cart.items[cartProdIndex].qty += 1 // just one step to update it.
    } else {
        updatedCartItems.push({
            productId: product._id, // the product Id inside the Item == the original product Id. 
            qty: newQty
        })
    }
    const updatedCart = { // update the entire cart with its items. 
        items: updatedCartItems
    }

    this.cart = updatedCart;

    return this.save()
}


userSchema.methods.removeFromCart = function(productId) {

    const updatedCartItems = this.cart.items.filter(item => {

        return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems

    return this.save()

}


userSchema.methods.emptyCart = function() {

    this.cart = { items: [] }

    return this.save()

}



module.exports = mongoose.model('User', userSchema) // Mongoose will create users collection for me named user + s.



//extend mongoose