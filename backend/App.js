// Dependencies
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const userRoute = require('./Routes/User')
const productRoute = require('./Routes/Product')
const AuthRouter = require('./Routes/Auth')
const cartRouter = require('./Routes/Cart')
const paymentRouter = require('./Routes/Payment')
require('dotenv').config()
const bodyParser = require('body-parser')



// Create server
const server = express()

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))

// Setting up frontend url
const corsOptions = {
  origin: ['https://meera-kohl.vercel.app', 'http://localhost:3000']
};

//Middleware
server.use(cors(corsOptions))
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
  const condb = await mongoose.connect(process.env.CONNECT_DB);
  console.log('Connected to MongoDB')
}

server.listen(8080)
