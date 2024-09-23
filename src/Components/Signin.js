import React from 'react'
import { Link } from "react-router-dom"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { ContextName } from '../Context/Context';
import { useContext } from 'react';
import Loading from './Loading';


function SignIn(props) {
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const [status, setStatus] = useState(false)
    const ContextItems = useContext(ContextName)
    const [inputType, setInputType] = useState("password")

    function showAndHidePass() {
        const openEye = document.getElementById('open-eye')
        const closeEye = document.getElementById('close-eye')
        if (inputType === "password") {
            setInputType("input")
        }
        else {
            setInputType("password")
        }
        openEye.classList.toggle('hide-field')
        closeEye.classList.toggle('hide-field')
    }
    async function handleSubmit(e) {
        e.preventDefault()
        ContextItems.setProgress(100)
        const postData = await axios.post("http://localhost:8080/signin", data)
        if (Object.keys(postData.data.success).length > 0) {
            ContextItems.setUser(postData.data.success)
            ContextItems.setCart(postData.data.success.cart)
            console.log('frrom', postData)
            ContextItems.setBookedProducts(postData.data.success.book)
            ContextItems.setCartCount(postData.data.success.cart.length)
            navigate('/')
        }
        else {
            ContextItems.setUser(postData.data.success)
            setStatus(true)
            setTimeout(() => {
                setStatus(false)
                console.log('usr not found')
            }, 3000)
        }
        ContextItems.setProgress(100)
    }
    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        data[name] = value
    }
    return (
        <div className="sign-container">
            <div className="sign">
                <h1>Sign in</h1>
                <p>Continue with <span>MEERA</span></p>
                <div className="user-status">
                    {
                        status &&
                        <div>User not found</div>
                    }
                </div>
                <form action="" className="sign-form" onSubmit={handleSubmit}>

                    <input id="email" type="email" placeholder="Email" name="email" className="email-input" required onChange={(e) => { handleChange(e) }} />
                    <div className="password-field-container">
                        <input id="password" type={inputType} placeholder="Password" name="password" className="email-input" required onChange={(e) => { handleChange(e) }} />
                        <i className='fas fa-eye show-password' id="open-eye" onClick={showAndHidePass}></i>
                        <i className='fas fa-eye-slash hide-password hide-field' id="close-eye" onClick={showAndHidePass}></i>
                    </div>

                    <button type="submit" className="sign-submit-btn">Sign in</button>
                </form>
                <div className="sign-up-link">
                    Don't Have an Account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default SignIn