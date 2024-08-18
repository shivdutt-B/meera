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



// Create server
const server = express()

// Setting up frontend url
const corsOptions = {
  origin: 'https://meera-kohl.vercel.app/',
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
}

server.listen(8080)
