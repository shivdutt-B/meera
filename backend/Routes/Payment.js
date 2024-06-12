const express = require('express')
const route = express.Router()
const payment = require('../Controllers/Payment')

route.post('/payment', payment.payment)

exports.paymentRouter = route
