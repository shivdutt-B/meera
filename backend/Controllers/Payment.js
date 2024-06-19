const userController = require('../Controllers/User')
const stripe = require("stripe")('sk_test_51No420SDdlneYxL6a3Ncg4WbLgDto2VClE7AEqXkf7Fo1vWX3V7buGBeZPERMUD4sL41nv3hcOfvJbYogAUrUkZG00dUfdvWcf')
exports.payment = async (req, res) => {
    try {
        console.log('make payjment',req.body)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.map(item => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: (item.price) * 100,
                    },
                    quantity: item.count,
                }
            }),
            success_url: 'http://localhost:3000/success',
            cancel_url: `${process.env.CLIENT_URL}`,
        })
        res.json({ url: session.url, products:req.body })
        
    } catch (e) {
        res.status(200).json({ error: e.message })
    }
    console.log('code er', req.body)
    await userController.addToOrders(req.body)
}