const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')


exports.signUp = async (req, res, next) => {
    try {

        const username = req.body.username // Getting username from body.
        const email = req.body.email // Getting email from body.
        const password = req.body.password // Getting password from body.

        if (username && email && password) {

            const existingUser = await userModel.findOne({ email: email })

            if (existingUser) {
                res.status(400).json({ message: "user already exists try using another email" })
            }
            else {
                const user = userModel(req.body)
                const saltRounds = 10
                const encryptedPassword = await bcrypt.hash(user.password, saltRounds)
                user.password = encryptedPassword
                await user.save()
                const token = await jwt.sign({ userId: user._id }, 'shhhhh');
                res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 100)})
                next()          
            }

        }
        else {
            res.json({ message: "All fields are necessary" })
        }

    } catch (error) {
        console.log(error)
    }

}