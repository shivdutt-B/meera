// Dependencies
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const signUp = require('./Middleware/Signup')
const cookieParser = require('cookie-parser')
const signIn = require('./Middleware/Signin')
const path = require('path');
const cors = require('cors');
const userRoute = require('./Routes/User')
const productRoute = require('./Routes/Product')
const storage = require('node-sessionstorage')
// const Auth = require('./Middleware/Auth')
const AuthRouter = require('./Routes/Auth')
const cartRouter = require('./Routes/Cart')
const paymentRouter = require('./Routes/Payment')
require('dotenv').config()



// Create server
const server = express()

//Middleware
server.use(cors())
server.use(express.json())
server.use(cookieParser())
server.use(userRoute.userRouter)
server.use(AuthRouter.AuthRouter)
server.use(productRoute.productRoute)
server.use(cartRouter.cartRouter)
server.use(paymentRouter.paymentRouter)


//Connecting to db
main().catch(err => console.log(err));
async function main() {
  // const condb = await mongoose.connect("mongodb+srv://shivduttBhadakwad:SVzKAQDXmAQZuwOk@cluster0.s8gjfqd.mongodb.net/ApniDukan");
  const condb = await mongoose.connect(process.env.CONNECT_DB);
  console.log('DB connection established')
}

server.listen(8080)
