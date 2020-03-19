// Product should match the string in exporting from mongoose...
const Product = require('../models/product');
// const path = require('path');

// const objectId = require('mongodb').ObjectId // how can I know that :) :) 




//  1-  router.get('/add-product', productController.getProduct)
exports.getProduct = (req, res, next) => {
    res.render('add-product', { 'pageTitle': 'Add Product', path: 'admin/product' });

};
//  2- router.post('/add-product', productController.postProduct)
exports.postProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    // const imageUrl = req.body.imageUrl;

    const image = req.file;
    console.log(image)
    const imageUrl = image.path;

    // bug can't read path of undifiend..

    const price = req.body.price;
    const desc = req.body.description
    const userId = req.user

    const prod = new Product({ title: title, imageUrl: imageUrl, price: price, desc: desc, userId: userId })
    prod.save() // Function from mongoose, no need to implement our function...
        .then(result => {
            res.redirect('/'); // to home
        }).catch(err => (console.log(err)))
};



// 5- router.get('/edit-product/:id', productController.getEditProduct)
exports.getEditProduct = (req, res, next) => {
    console.log(req.session.isLoggedIn)
    const prodId = req.params.id // get the prod ID from the view.....

    Product.findById(prodId)
        .then(product => {
            console.log("product Saved afterEdit..., will render edit Page with by Id... ")
            res.render('edit-product', { 'prod': product, 'pageTitle': 'edit Product' })
        }).catch(err => console.log(err))
}


// 6- router.post('/edit-product', productController.postEditedProduct)
exports.postEditedProduct = (req, res, next) => {
    //add the user ID...

    // console.log(req.body.id)

    Product.findById(req.body.id).then(product => { //bug  Had to change req.body.prodId it to id, it was ProdId..
            // console.log(product)
            product.title = req.body.title;
            product.imageUrl = req.body.imageUrl;
            product.price = req.body.price; //bug it was imageUrl.
            product.desc = req.body.desc

            product.save(); // without return..  or With Return, ??
        }).then(result => {
            console.log("product Updated..., will redirect to '/'")
            res.redirect('/')
        })
        // const product = new Product(new objectId(req.body.id), req.body.title, req.body.imageUrl, req.body.price, req.body.description, null)
}

// 7- router.post('/delete-product', productController.deleteProduct) // bug // forgot to add admin to shop.ejs  /admin/delete-product
exports.deleteProduct = (req, res, next) => {
    Product.findByIdAndDelete(req.body.id)
        .then(product => {

            console.log("Product Deleted...")
                // console.log(product)

            res.redirect('/')
        })
        .catch(err => { console.log(err) })
}