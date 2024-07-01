const userModel = require('../Models/User').userModel
const jwt = require('jsonwebtoken')
const storage = require('node-sessionstorage')
const productModel = require('../Models/Product')

exports.addToCart = async (req, res) => {
    try {
        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh') // Got user id here
        // const existingProduct = await userModel.findById(user.userId) //1st
        let product = req.body
        // console.log('cod22',product)

        const updatedData = await userModel.findByIdAndUpdate((user.userId), {
            $push: {
                cart: product
            }
        }, { new: true })
        // res.status(200).json({ 'length': updatedData.cart.length, 'cartItems': updatedData.cart })
        // console.log('thi sis ', updatedData)
        // res.status(200).json({'success':true, "products":updatedData.cart})
        res.status(200).json({'success':true, 'length':updatedData.cart.length})

    } catch (error) {
        // console.log(error)
        res.status(200).json({'success':false})
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh')
        // const existingProduct = await userModel.findById(user.userId) //1st

        // console.log('REMOVING FROM CART', req.body)
        // const updateData = await userModel.updateOne({ _id: user.userId }, { $pull: { cart: { _id: req.body._id } } }, {new:true});
        const updateData = await userModel.findByIdAndUpdate((user.userId), {
            $pull: {
                cart: { _id: req.body._id }
            }
        }, { new: true })
        // console.log('thi sis ', updateData.cart.length)
        // res.status(200).json({ 'length': updateData.cart.length , 'cartItems': updateData.cart})
        // res.status(200).json({ 'success': true ,"products":updateData.cart})
        res.status(200).json({"success": true, 'length':updateData.cart.length })
    }
    catch(error){
        // console.log('ERROR12', error)
        res.status(200).json({ 'success': false})
    }
}

exports.getCart = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')
    const existingProduct = await userModel.findById(user.userId) //1st

    res.status(200).json(existingProduct.cart)
}

exports.increaseItem = async (req, res) => {
    try{

        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh')
        
        const resp = await userModel.findOneAndUpdate({ _id: user.userId, "cart._id": req.body.productId }, { $inc: { "cart.$.count": 1 } }, { new: true });
        res.json({success:true}) // send success either true or false then on front end use success to update the data in the context states
    } catch(error) {
        res.json({success: false})
    }
}

exports.dItem = async (req, res) => {
    try{

        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh')
        
        const resp = await userModel.findOneAndUpdate({ _id: user.userId, "cart._id": req.body.productId }, { $inc: { "cart.$.count": -1 } }, { new: true });
        res.status(200).json({success: true})
    } catch (error) {
        res.json({success: false})
    }

}

exports.orders = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')
    const existingProduct = await userModel.findById(user.userId) //1st

    res.status(200).json(existingProduct.order)
}
exports.removeFromOrder = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')
    // const existingProduct = await userModel.findById(user.userId) //1st

    const productId = req.body.productId
    // console.log('req body', req.body)
    // const updatedData = await userModel.updateOne({ _id: user.userId }, { $pull: { order: { _id: productId } } }, {new:true});
    const updatedData = await userModel.findByIdAndUpdate((user.userId), {
        "$pull": {
            "order": { _id: productId }
        }
    }, { new: true })
    // console.log('UPDATED DATA', updatedData)
    res.status(200).json({ 'success': true})
}