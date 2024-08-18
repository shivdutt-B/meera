import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ContextName } from '../Context/Context';
import { useContext } from 'react';


function SignIn() {
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const ContextItems = useContext(ContextName)

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            ContextItems.setProgress(10)
            const token = await sessionStorage.getItem('token')
            const postData = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/address`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include JWT in the Authorization header
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(data)
            })
            const postDataParsed = await postData.json()
            if (postDataParsed.success) {
                ContextItems.user.address = data.address
                navigate('/')
            }
            else {
                navigate('/error')
            }
        } catch (error) {
            navigate('/error')
        }
        finally {
            ContextItems.setProgress(100)
        }

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