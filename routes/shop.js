const express = require('express');
const path = require('path');
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();


// // router.get(['/', 'products'], shopController.getAllProducts);   //is not working with [products]

router.get(['/', 'products'], shopController.getAllProducts);

router.get('/products/:prodId', shopController.getProductDetails); // we named the key as prodId

router.get('/cart', isAuth, shopController.getCart)

router.post('/cart', isAuth, shopController.postCart)

router.post('/deleteFromCart', isAuth, shopController.deleteProduct)

router.get('/checkout', isAuth, shopController.getCheckOut)

router.get('/checkout/success', shopController.getCheckSuccess)
router.get('/checkout/cancel', shopController.getCheckOut)


// router.post('/order', isAuth, shopController.postOrder)

router.get('/order', isAuth, shopController.getFinalOrder)


module.exports = router;