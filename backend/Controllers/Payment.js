require('dotenv').config()
const model = require('../Models/User'); // importing model file
const userModel = model.userModel; // importing model 

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
    try {
        const { modItems } = req.body;
        const userId = await req.userId;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: modItems.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: item.title },
                        unit_amount: item.price*100,
                    },
                    quantity: item.count,
                };
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/failed`,
            metadata: {
                userId: userId,
                product: JSON.stringify(modItems.map(product => {return {"_id": product._id, 'count':product.count}}))
            },
        });

        res.json({ url: session.url });
    } catch (e) {   
        res.status(500).json({ error: e.message });
    }
};

async function addToOrder(userId, products) {
    try {
        const user = await userModel.findById(userId);

        products.forEach(async incomingItem => {
            const existingOrder = user.order.find(orderItem => orderItem._id == incomingItem._id);

            if (existingOrder) {
                await userModel.findOneAndUpdate(
                    { '_id': userId, 'order._id': incomingItem._id },
                    { $inc: { 'order.$.count': incomingItem.count } },
                    { new: true }
                );
            } else {
                user.order.push(incomingItem);
            }
        });

        return await user.save();
    } catch (err) {
        throw err;
    }
}

const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

exports.stripeWebHook = async (request, response) => {
    let event = request.body;
    if (endpointSecret) {
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log('HERE IS THE ERROR: ', err.message)
            console.log('ENDPOINT SECRET: ', endpointSecret)
            return response.sendStatus(400);
        }
    }

    if (event.type === 'checkout.session.completed'){
        try {
            const session = event.data.object; // accessing the stripe session

            const product = JSON.parse(session.metadata.product); // Convert string back to object
            const userId = session.metadata.userId;

            await addToOrder(userId, product);
            response.json({ status: 'Order processed successfully' });
        } catch (err) {
            response.status(500).json({ error: 'Failed to process order' });
        }
    } else {
        response.sendStatus(400);
    }
};
