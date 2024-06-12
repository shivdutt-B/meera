const jwt = require('jsonwebtoken')
const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
// const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const storage = require('node-sessionstorage')


exports.signIn = async (req, res, next) => {
    try {
        const token = await storage.getItem('token')
        console.log('TOKEN',token)
        if (token) {
            console.log('flagm')
            const decodeToken = jwt.verify(token, "shhhhh")
            const existingUser = await userModel.findOne({ _id: decodeToken.userId })
            if (existingUser) {
                console.log('CHECK REQUIREST',req)
                // req.success = true
                req.user = existingUser
                next()
            }
            else {
                req.user = false
                next()
            }
            // res.status(200).json(existingUser)
            // return true
            // return true
        }
        else {
            console.log('flagm2')
            // res.json({success: false})
            req.user = false
            // res.redirect(301, "/signIn");
            // res.writeHead(302, {'Location':'http://localhost:3000/signIn'})
            next()
        }

    } catch (error) {
        console.log(error)
    }

}