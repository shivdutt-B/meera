const jwt = require('jsonwebtoken')
const model = require('../Models/User') // importing model file
const userModel = model.userModel // importing model 
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const express = require('express');
const storage = require('node-sessionstorage')

exports.signIn = async (req, res, next) => {
    try {

        // console.log('flag2')
        const email = await req.body.email // Getting email from body.
        const password = await req.body.password // Getting password from.
        // console.log('body', email, password)

        if (email && password) {

            const existingUser = await userModel.findOne({ email: email })
            // console.log('EX',existingUser)

            if (!existingUser) {
                // console.log('flaga')
                res.status(200).json({ success: {} })
            }

            else {
                console.log('flag/3')
                const decryptPassword = await bcrypt.compare(password, existingUser.password)
                if (decryptPassword) {
                    const token = await jwt.sign({ userId: existingUser._id }, 'shhhhh');
                    storage.setItem('token', token)
                    // console.log('item set:', storage.getItem('foo'))
                    res.status(200).json({ success: existingUser })

                }
                else {
                    res.status(200).json({ success: {} })
                }
            }

        }
        else {
            res.json({ message: "All fields are necessary" })
        }

    } catch (error) {
        console.log(error)
    }

}


exports.signUp = async (req, res, next) => {
    try {

        // const firstname = req.body.firstname
        // const lastname = req.body.lastname
        const username = req.body.username // Getting username from body.
        const email = req.body.email // Getting email from body.
        const password = req.body.password // Getting password from body.
        const mobile = req.body.mobile
        // const address = req.body.address

        if (username && email && password && mobile) {

            const existingUser = await userModel.findOne({ email: email })
            console.log('Exisint', existingUser)

            if (existingUser) {
                res.status(200).json({ success: false })
            }
            else {
                console.log(req.body)
                const user = await userModel(req.body)
                const saltRounds = 10
                const encryptedPassword = await bcrypt.hash(user.password, saltRounds)
                user.password = encryptedPassword
                await user.save()
                // const token = await jwt.sign({ userId: user._id }, 'shhhhh');
                // sessionStorage.setItem('token',token)
                res.status(200).json({ success: true })

            }

        }
        else {
            res.json({ message: "All fields are necessary" })
        }

    } catch (error) {
        console.log(error)
    }

}

exports.logOut = async (req, res, next) =>  {
    res.status(200).json({})
    storage.setItem('token', '')
}

exports.deleteAccount = async (req, res, next) =>  {
    const user = req.body.user
    await userModel.findByIdAndDelete(user)
    storage.setItem('token', '')
    res.status(200).json({})
}

exports.address = async (req, res, next) => {
    const address = req.body.address
    const token = await storage.getItem('token')
    const decodeToken =  await jwt.verify(token, "shhhhh")
    const response = await userModel.findByIdAndUpdate(decodeToken.userId, { $set: { address: address }},{new : true})
    res.status(200).json(response)   
}

exports.addToOrders = async (data) => {
    const token = await storage.getItem('token')
    const decodeToken = await jwt.verify(token, "shhhhh")
    data.map(async (item) => {
        const updatedData = await userModel.findByIdAndUpdate((decodeToken.userId), {
            "$push": {
                "order": item
            }
        })
    })
    }