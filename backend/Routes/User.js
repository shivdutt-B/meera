const express = require('express');
const route = express.Router()
const userController = require('../Controllers/User')
const auth = require('../Middleware/Auth')

route.post('/signin', userController.signIn)
route.post('/signup', userController.signUp)
route.post('/delete', auth.Verify, userController.deleteAccount)
route.post('/address', auth.Verify, userController.address)
exports.userRouter = route     