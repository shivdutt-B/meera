const express = require('express')
const route = express.Router()
const auth = require('../Middleware/Auth')
const payment = require('../Controllers/Payment')

route.post('/create-checkout-session', auth.Verify, payment.payment)
route.post('/stripe_webhooks',  payment.stripeWebHook)

exports.paymentRouter = route



