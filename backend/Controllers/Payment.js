const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
const bodyParser = require('body-parser')
const express = require('express');
// const { v4: uuidv4 } = require('uuid');
const storage = require('node-sessionstorage')

const tempOrders = {};

// const saveTempOrder = async (tempOrderId, orderData) => {
//     tempOrders[tempOrderId] = orderData;
// };

// const getTempOrder = async (tempOrderId) => {
//     return tempOrders[tempOrderId];
// };

const stripe = require("stripe")('sk_test_51No420SDdlneYxL6a3Ncg4WbLgDto2VClE7AEqXkf7Fo1vWX3V7buGBeZPERMUD4sL41nv3hcOfvJbYogAUrUkZG00dUfdvWcf')
const userController = require('../Controllers/User');

exports.payment = async (req, res) => {
    try {
        const { itemsToOrder, userId } = req.body
        console.log('HI IS ')
        // Generate a unique identifier for the order
        // const tempOrderId = uuidv4();
        // console.log('TEMP ID', tempOrderId)

        // await saveTempOrder(tempOrderId, { itemsToOrder, userId });
        await storage.setItem('tempOrder', { itemsToOrder, userId })


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: itemsToOrder.map(item => {
                const discountedPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: Math.round(parseFloat(discountedPrice) * 100),
                    },
                    quantity: item.count,
                };
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/failed`,
            // metadata: {
            //     temp_order_id: tempOrderId
            // }
        });
        // res.json({ url: session.url, products: req.body, id: session.id });
        // res.json({ url: session.url, products: req.body, id: session.id });
        res.json({ url: session.url });
    } catch (e) {
        console.log('pay er', e)
        res.status(500).json({ error: e.message });
    }
};

async function addToOrder(userId, products) {
    console.log('SAVING ITEMS')
    const user = await userModel.findById(userId)
 
    products.forEach(async incomingItem => {
        const existingOrder = user.order.find(orderItem => orderItem._id == incomingItem._id);

        if (existingOrder) {
            console.log('YES ITS THERE')
            await userModel.findOneAndUpdate(
                { '_id': userId, 'order._id': incomingItem._id }, // Query condition
                { $inc: { 'order.$.orderQnt': incomingItem.orderQnt } }, // Update operation: $inc to increment orderQnt
                { new: true } // Options: return the updated document
            )
        } else {
            user.order.push(incomingItem);
        }
    });
    const savedUser = await user.save()
    console.log('WHAT SAVED', savedUser)

}


const endpointSecret = "whsec_bbe782e9e42110d52c397a17f9e23d80613a59e366dedef3af0c950ff7b39159"

exports.stripeWebHook = async (request, response) => {
    console.log('code 11')
    // Body is already parsed as the parsing function is installed at the main server. So don't need to add any parser on this endpoint.
    let event = request.body;

    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // If webhook signature verification is completed successfully.
    // Handle the event
    // let originalBody = await request.rawBody.toString();
    // console.log('code w', originalBody)
    // switch (event.type) {
    //     case 'checkout.session.completed': // If checkout session is completed then will proceed to place the user's order.
    //         const session = event.data.object;
    //         const paymentIntent = event.data.object;
    //         // console.log(`session completed for ${paymentIntent.amount} was successful!`);
    //         const orders = await storage.getItem('tempOrder')
    //         console.log('temp', orders.userId, orders.itemsToOrder)
    //         const fp =  await addToOrder(orders.userId, orders.itemsToOrder)
    //         console.log('fp', fp)
    //         // Return a 200 response to acknowledge receipt of the event
    //         response.json({ status: 'haa bhai ho giya' });
    // }

    if (event.type == 'checkout.session.completed'){
        console.log('SESSION COMPLETED')
        const orders = await storage.getItem('tempOrder')
        // console.log('temp', orders.userId, orders.itemsToOrder)
        const fp =  await addToOrder(orders.userId, orders.itemsToOrder)
        console.log('fp', fp)
        // Return a 200 response to acknowledge receipt of the event
        response.json({ status: 'haa bhai ho giya' });
    }
};

// exports.stripeWebHook = (async (req, res) => {
//     // const rawBody = await express.raw(req)

//     console.log('code 322', req.body)
//     console.log('CODE 04', req.headers)

//     const sig = await req.headers['stripe-signature'];
//     let event;
//     let strBody = await JSON.stringify(req.body)

//     console.log('signature', sig)
//     try {
//         event = stripe.webhooks.constructEvent(strBody, sig, endpointSecret);
//         console.log('event gen', event)
//     } catch (err) {
//         console.error('Webhook error: code 0045', err.message);
//         // return res.status(400).send(`Webhook Error: ${err.message}`);
//     }


//     // Handle the event checkout.session.completed
//     if (event.type === 'payment_intent.succeeded') {
//         console.log('code 08467')
//         const session = event.data.object;
//         // Fulfill the purchase or any other business logic
//         console.log(`Payment completed for session: ${session.id}`);
//         // You can save session details to your database or perform other actions
//     }

//     res.json({ received: true });
// }
// );

// app.post('/stripe_webhooks', bodyParser.raw({ type: 'application/json' }), (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, 'your-webhook-signing-secret');
//     } catch (err) {
//         console.log(`Webhook signature verification failed: ${err.message}`);
//         return res.sendStatus(400);
//     }

//     // Handle the checkout.session.completed event
//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;
//         // Fulfill the purchase, e.g., update database, send email, etc.
//         console.log(`Payment was successful for user ID: ${session.metadata.userId}`);
//     }

//     res.sendStatus(200);
// });