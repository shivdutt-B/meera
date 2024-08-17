const express = require('express')
const route = express.Router()
const cart = require('../Controllers/Cart')
const auth = require('../Middleware/Auth')

route.post('/addtocart', auth.Verify, cart.addToCart)
route.post('/removefromcart', auth.Verify, cart.removeFromCart)
route.post('/decreaseitem', auth.Verify, cart.dItem)
route.post('/increaseitem', auth.Verify, cart.increaseItem)
route.post('/removefromorder',auth.Verify, cart.removeFromOrder)

exports.cartRouter = route