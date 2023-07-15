const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../../controllers/productCtrls/productControl');
const { isAuthorized } = require('../../middlewares/isAuthorized');
const productRouter = express.Router()

productRouter.route('/products').get(getAllProducts)
productRouter.route('/products/new').post(isAuthorized , createProduct)
productRouter.route('/products/:id').put(isAuthorized,updateProduct).delete(isAuthorized,deleteProduct).get(getProductDetails)

module.exports = {productRouter}
