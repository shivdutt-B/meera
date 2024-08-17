const jwt = require('jsonwebtoken')
const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
const bcrypt = require('bcrypt')
const product = require('../Models/Product')
const productModel = product.productModel


const fetchProductInfo = async (productsArray) => {
    try {
        // Extract just the product IDs from the array
        const productIds = productsArray.map(item => item._id);

        // Fetch product information for the given IDs
        const products = await productModel.find({ _id: { $in: productIds } });

        // Merge the count with the corresponding product information
        const productsWithCount = productsArray.map(item => {
            const productInfo = products.find(product => product._id.toString() === item._id);
            return {
                ...productInfo.toObject(), // Convert the Mongoose document to a plain object
                count: item.count // CHANGE PRODUCT
            };
        });

        return productsWithCount;
    } catch (error) {
        return [];
    }
};

exports.signIn = async (req, res, next) => {
    try {

        const email = await req.body.email // Getting email from body.
        const password = await req.body.password // Getting password from.

        if (email && password) {

            const existingUser = await userModel.findOne({ email: email })

            if (!existingUser) {
                res.status(200).json({ success: false, message: 'User does not exist.' })
            }

            else {
                const decryptPassword = await bcrypt.compare(password, existingUser.password)
                if (decryptPassword) {
                    const token = await jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET);

                    const fullProduct = await fetchProductInfo(existingUser.order)
                    existingUser['order'] = fullProduct;

                    res.status(200).json({ success: true, user: existingUser, token: token })

                }
                else {
                    res.status(200).json({ success: false, message: 'Credentials does not match.' })
                }
            }

        }
        else {
            res.json({ success: false, message: 'All fields are necessary' })
        }

    } catch (error) {
        res.json({ success: false, message: 'Something went wrong!' })
    }

}


exports.signUp = async (req, res, next) => {
    try {

        const username = req.body.username // Getting username from body.
        const email = req.body.email // Getting email from body.
        const password = req.body.password // Getting password from body.
        const mobile = req.body.mobile

        if (username && email && password && mobile) {

            const existingUser = await userModel.findOne({ email: email })

            if (existingUser) {
                res.status(200).json({ success: false, message: 'User already exist with this email.' })
            }
            else {
                const user = await userModel(req.body)
                const SALTROUNDS = 10
                const encryptedPassword = await bcrypt.hash(user.password, SALTROUNDS)
                user.password = encryptedPassword
                await user.save()
                res.status(200).json({ success: true })

            }

        }
        else {
            res.json({ success: false, message: 'All fields are necessary.' })
        }

    } catch (error) {
        res.json({ success: false, message: 'Something went wrong.' })
    }

}

exports.deleteAccount = async (req, res, next) => {
    try {
        const user = req.body.user
        const deletedUser = await userModel.findByIdAndDelete(user)
        if (deletedUser) {
            res.status(200).json({ success: true })
        }
        else {

        }
    }
    catch (error) {
        res.json({ success: false })
    }
}

exports.address = async (req, res, next) => {

    try {
        const address = req.body.address
        const userId = req.userId
        const response = await userModel.findByIdAndUpdate(userId, { $set: { address: address } }, { new: true })
        res.status(200).json({ success: true }) // No need to send the whole user(response) just send the success and handle things according to that.
    } catch (error) {
        res.json({ success: false })
    }
}

exports.addToOrders = async (req, res) => {
    try {
        const data = req.body.data;
        const userId = req.body.userId;


        const user = await userModel.findById(userId)

        data.forEach(async incomingItem => {
            const existingOrder = user.order.find(orderItem => orderItem._id == incomingItem._id);

            if (existingOrder) {
                await userModel.findOneAndUpdate(
                    { '_id': decodeToken.userId, 'order._id': incomingItem._id }, // Query condition
                    { $inc: { 'order.$.orderQnt': incomingItem.orderQnt } }, // Update operation: $inc to increment orderQnt
                    { new: true } // Options: return the updated document
                )
            } else {
                user.order.push(incomingItem);
            }
        });
        await user.save()
        res.status(200).json({ success: true, updData: user }) 
    } catch (error) {
        res.json({ "success": false })
    }
}