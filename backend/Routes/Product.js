const express = require('express');
const route = express.Router()
const productController = require('../Controllers/Product')
const signIn = require('../Middleware/Signin')

route.get('/products',productController.showAll)
route.post('/category',productController.bySearch)
route.post('/addproduct', productController.addProduct)


exports.productRoute = route