const jwt = require('jsonwebtoken')
const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
// const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const storage = require('node-sessionstorage')


exports.Auth = async (req, res, next) => {
    try {
        const token = await storage.getItem('token')
        // console.log('TOKEN', token)
        if (token) {
            const decodeToken = jwt.verify(token, "shhhhh")
            const existingUser = await userModel.findOne({ _id: decodeToken.userId })
            // console.log('USER', existingUser)
            if (existingUser) {
                res.status(200).json({'user':existingUser})
            }
            else {
                res.json({'user':false})
            }
        }
        else {
            res.json({'user':false})
        }

    } catch (error) {
        console.log(error)
    }

}