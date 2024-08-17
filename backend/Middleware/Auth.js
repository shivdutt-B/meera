const jwt = require('jsonwebtoken')
const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
const storage = require('node-sessionstorage')
const product = require("../Models/Product")
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

exports.Auth = async (req, res, next) => {
    try {
        const reqHeader = req.headers.authorization
        if (reqHeader) {
            const token = reqHeader.split(' ')[1]
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
            if (decodeToken) {
                const existingUser = await userModel.findOne({ _id: decodeToken.userId })
                if (existingUser) {
                    const orderedProducts = await fetchProductInfo(existingUser.order)
                    existingUser.order = orderedProducts
                    res.status(200).json({ 'user': existingUser })
                }
                else {
                    res.json({ 'user': false })
                }
            }
            else {
                res.json({ 'user': false })
            }
        }
        else {
            res.json({ 'user': false })
        }


    } catch (error) {
        res.json({ 'user': false })
    }

}

exports.Verify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)
            if (decodeToken) {
                req.userId = decodeToken.userId
                next()
            }
            else {
                res.json({ 'success': false })
            }
        }
        else {
            res.json({ 'success': false })
        }
    } catch (error) {
        res.json({ 'success': false })
    }
}