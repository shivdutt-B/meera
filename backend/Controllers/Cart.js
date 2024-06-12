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
        console.log('cod22',product)

        const updatedData = await userModel.findByIdAndUpdate((user.userId), {
            $push: {
                cart: product
            }
        }, { new: true })
        // res.status(200).json({ 'length': updatedData.cart.length, 'cartItems': updatedData.cart })
        console.log('thi sis ', updatedData)
        res.status(200).json({'success':true, "products":updatedData.cart})

    } catch (error) {
        console.log(error)
        res.status(200).json({'success':false})
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh')
        // const existingProduct = await userModel.findById(user.userId) //1st

        // const updateData = await userModel.updateOne({ _id: user.userId }, { $pull: { cart: { _id: req.body._id } } }, {new:true});
        const updateData = await userModel.findByIdAndUpdate((user.userId), {
            $pull: {
                cart: { _id: req.body._id }
            }
        }, { new: true })
        // console.log('thi sis ', updateData)
        // res.status(200).json({ 'length': updateData.cart.length , 'cartItems': updateData.cart})
        res.status(200).json({ 'success': true ,"products":updateData.cart})
    }
    catch(error){
        res.status(200).json({ 'success': false })
    }
}

exports.getCart = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')
    const existingProduct = await userModel.findById(user.userId) //1st

    res.status(200).json(existingProduct.cart)
}

exports.increaseItem = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')

    const resp = await userModel.findOneAndUpdate({ _id: user.userId, "cart._id": req.body.productId }, { $inc: { "cart.$.count": 1 } }, { new: true });
    res.json(resp.cart)
}

exports.dItem = async (req, res) => {
    const token = storage.getItem('token')
    const user = await jwt.verify(token, 'shhhhh')

    const resp = await userModel.findOneAndUpdate({ _id: user.userId, "cart._id": req.body.productId }, { $inc: { "cart.$.count": -1 } }, { new: true });
    res.status(200).json(resp.cart)

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
    console.log('req body', req.body)
    // const updatedData = await userModel.updateOne({ _id: user.userId }, { $pull: { order: { _id: productId } } }, {new:true});
    const updatedData = await userModel.findByIdAndUpdate((user.userId), {
        "$pull": {
            "order": { _id: productId }
        }
    }, { new: true })
    console.log('UPDATED DATA', updatedData)
    res.status(200).json({ 'success': true })
}

exports.addToBook = async (req, res) => {
    try {
        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh') // Got user id here
        // const existingProduct = await userModel.findById(user.userId) //1st
        const product = req.body

        const updatedData = await userModel.findByIdAndUpdate((user.userId), {
            $push: {
                book: product
            }
        }, { new: true })
        console.log('code j999k', updatedData.book)
        res.status(200).json({"status":true ,'bookItems': updatedData.book })

    } catch (error) {
        res.status(200).json({"status": false})
    }
}

exports.removeFromBook = async (req, res) => {
    try{
        const token = storage.getItem('token')
        const user = await jwt.verify(token, 'shhhhh')
        const updatedData = await userModel.findByIdAndUpdate((user.userId), {
            $pull: {
                book: { _id: req.body._id }
            }
        }, { new: true })
        console.log('REMOVE BOOK: ', updatedData)
        
        res.status(200).json({ "status": true,'bookItems': updatedData.book })
    }
    catch (error){
        res.status(200),json({"status":false})
    }
}