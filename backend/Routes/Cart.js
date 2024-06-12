const express = require('express')
const route = express.Router()
const cart = require('../Controllers/Cart')

route.post('/addtocart', cart.addToCart)
route.post('/removefromcart', cart.removeFromCart)
route.get('/getcart', cart.getCart)
route.post('/decreaseitem', cart.dItem)
route.post('/increaseitem', cart.increaseItem)
route.get('/order',cart.orders)
route.post('/removefromorder',cart.removeFromOrder)
route.post('/addtobook', cart.addToBook)
route.post('/removefrombook', cart.removeFromBook)

exports.cartRouter = route