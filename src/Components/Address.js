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

    async function handleSubmit(e) {
        e.preventDefault()
        ContextItems.setProgress(10)
        console.log('Submit', data)
        const postData = await axios.post("http://localhost:8080/address", data)
        console.log('ps', postData)
        ContextItems.setUser(postData.data)
        ContextItems.setProgress(100)
        navigate('/')

    }

    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        data[name] = value
    }
    return (
        <div className="sign-container">
            <div className="sign">
                <h1>Address</h1>
                <form action="" className="sign-form" onSubmit={handleSubmit}>

                    <input id="email" type="text" placeholder="Address" name="address" className="email-input" required onChange={(e) => { handleChange(e) }} />
                    <button type="submit" className="sign-submit-btn">Proceed</button>
                </form>
            </div>
        </div>
    )
}

export default SignIn