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
const bodyParser = require('body-parser')
const getRawBody = require('raw-body')
const { appendFile } = require('fs')


// Create server
const server = express()

// Parsing the request body it's raw form for stripe webhook.
server.use(bodyParser.urlencoded({extended:false}))
server.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))


server.use(cors())
server.use(express.json())
server.use(cookieParser())
server.use(userRoute.userRouter)
server.use(AuthRouter.AuthRouter)
server.use(productRoute.productRoute)
server.use(cartRouter.cartRouter)
server.use(paymentRouter.paymentRouter)


// This is your test secret API key.
// const stripe = require('stripe')('sk_test_51No420SDdlneYxL6a3Ncg4WbLgDto2VClE7AEqXkf7Fo1vWX3V7buGBeZPERMUD4sL41nv3hcOfvJbYogAUrUkZG00dUfdvWcf');
// const endpointSecret = 'whsec_bbe782e9e42110d52c397a17f9e23d80613a59e366dedef3af0c950ff7b39159';


// server.post('/stripe_webhooks', async (request, response) => {
//   console.log('HII')
//   const tempData = await storage.getItem('tempOrder')
//   console.log('CODE 5R', tempData)
//   // Body is already parsed as the parsing function is installed at the main server. So don't need to add any parser on this endpoint.
//   let event = request.body;
  
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.rawBody,
//         signature,
//         endpointSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }
//   }

//   // If webhook signature verification is completed successfully.
//   // Handle the event
//   // console.log('code w', event.data.object.metadata)
//   switch (event.type) {
//     case 'checkout.session.completed': // If checkout session is completed then will proceed to place the user's order.
//       const paymentIntent = event.data.object;
//       console.log(`session completed for ${paymentIntent.amount} was successful!`);
//       break;

//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });



//Connecting to db
main().catch(err => console.log(err));
async function main() {
  // const condb = await mongoose.connect("mongodb+srv://shivduttBhadakwad:SVzKAQDXmAQZuwOk@cluster0.s8gjfqd.mongodb.net/ApniDukan");
  const condb = await mongoose.connect(process.env.CONNECT_DB);
  console.log('DB connection established')
}

server.listen(8080)
