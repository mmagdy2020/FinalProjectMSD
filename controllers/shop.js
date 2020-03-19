const Product = require('../models/product');

const Order = require('../models/order')

const stripe = require('stripe')('sk_test_fett5YnZvGzkgsm8c8rY9Mi6002jHssCdm') // private Key from my account..

// 3- router.get(['/', 'products'], shopController.getAllProducts);
exports.getAllProducts = (req, res, next) => {
    // console.log(Product.getAll());
    Product.find() // with mongoose, find will return all of the products inside it.
        // .select('title price -_id')
        // .populate('userId')
        .then(product => {
            // console.log(product)
            console.log("=--------------=")
            res.render('shop', { 'prods': product, path: 'admin/product', 'pageTitle': 'Products-Shop' });
        }).catch(err => console.log(err))
}


// 4 - router.get('/products/:prodId', shopController.getProductDetails); // we named the key as prodId
exports.getProductDetails = (req, res, next) => {

    const prodId = req.params.prodId // get the prod ID from the view.....
    Product.findById(prodId)
        .then(doc => {
            res.render('product-detail', { 'product': doc, 'pageTitle': 'Product-details' })
                // console.log(doc)

        }).catch(err => console.log(err))
}




exports.getCart = (req, res, next) => {

    if (req.user) {
        // request user, which mean the specific user that we are using right now.
        // console.log("UserIDD" + req.session.user._id)
        req.user
            .populate('cart.items.productId').execPopulate() // the result from then will be the entire user Object..
            .then(user => {
                // console.log(user.cart.items) // so our
                const products = user.cart.items // 
                res.render('cart', { "products": products, 'pageTitle': 'User-Cart' }) // the products will named as productId // Important.....
            }).catch(err => console.log(err))
    } else {
        let products = []
        res.render('cart', { "products": products, 'pageTitle': 'User-Cart' })
    }

}


exports.postCart = (req, res, next) => {

    const prodId = req.body.prodId; // from the cart name: shop.ejs
    console.log(prodId + " from POst") // it is working now...
    Product.findById(prodId).then(product => {
        // console.log(product)
        return req.user.addToCart(product) // req,user (should return the user defined in the app.js)

    }).then(result => {
        // console.log(result)
        res.redirect('/cart')
    }).catch(err => console.log(err))


}

exports.deleteProduct = (req, res, next) => {

    const productId = req.body.prodId;

    req.user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart')
        }).catch(err => console.log(err))

}



exports.getCheckOut = (req, res, next) => {

    let products;

    if (req.user) {
        // request user, which mean the specific user that we are using right now.
        // console.log("UserIDD" + req.session.user._id)
        req.user
            .populate('cart.items.productId').execPopulate() // the result from then will be the entire user Object..
            .then(user => {
                // console.log(user.cart.items) // so our
                products = user.cart.items // 

                //for payment..active
                return stripe.checkout.sessions.create({ //bug sessions instead of session.
                        payment_method_types: ['card'], //bug method not methods..
                        line_items: products.map(p => {
                            return {
                                name: p.productId.title,
                                description: p.productId.desc,
                                amount: p.productId.price * 100,
                                currency: 'usd',
                                quantity: p.qty

                            }

                        }),
                        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel' //bug I used success in the two links...


                    })
                    .then(session => {
                        console.log(session.id)
                        res.render('checkout', { "products": products, sessionId: session.id, 'pageTitle': 'CheckOut' }) //sessionId we should to add it to HTML...

                    })

            }).catch(err => console.log(err))
    } else {
        let products = []
        res.render('checkout', { "products": products, 'pageTitle': 'CheckOut' })
    }

}



//changed from postOrder to getCheckSuccess
exports.getCheckSuccess = (req, res, next) => {

    console.log(req.user)
    req.user
        .populate('cart.items.productId') // trying to accessing the reference for the product with user.
        .execPopulate() // usually it linked to two field {productId, qty}
        .then(user => {
            const products = user.cart.items.map(item => {
                return ({ qty: item.qty, product: {...item.productId._doc } })
            })

            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })

            return order.save() //should I return or no...  
        })
        .then(result => {
            return req.user.emptyCart() //empty the User Cart...
        }).then(result => {
            res.redirect('/order')
        })
        .catch(err => console.log(err))
}


exports.getFinalOrder = (req, res, next) => {

    Order.find({ "user.userId": req.user._id }) // we can use find to locate all of the order for this userID... 
        .then(orders => {
            console.log(orders)
            res.render('order', { orders: orders, 'pageTitle': 'User-Orders' })
        })
        .catch(err => console.log(err))
}