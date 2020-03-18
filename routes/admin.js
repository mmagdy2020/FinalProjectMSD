const express = require('express');
const productController = require('../controllers/admin')
const permit = require('../middleware/permissions');
const isAuth = require('../middleware/is-auth')


const options = {
    "caseSensitive": false,
    "strict": false
};
const router = express.Router(options);


router.get('/add-product', permit(true), productController.getProduct)

router.post('/add-product', isAuth, permit(true), productController.postProduct)



router.get('/edit-product/:id', isAuth, permit(true), productController.getEditProduct)
router.post('/edit-product', isAuth, permit(true), productController.postEditedProduct)


router.post('/delete-product', isAuth, permit(true), productController.deleteProduct) // bug // forgot to add admin to shop.ejs  /admin/delete-product


module.exports = router;