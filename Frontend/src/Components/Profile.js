import React, { useContext} from 'react'
import { ContextName } from '../Context/Context'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Profile() {
    const ContextItems = useContext(ContextName)
    const navigate = useNavigate()

    async function logOut() {
        try {
            ContextItems.setProgress(10)
            ContextItems.setUser(false)
            ContextItems.setCart([])
            ContextItems.setOrder([])
            ContextItems.setBookedProducts([])
            ContextItems.setCartCount(0)
            await sessionStorage.removeItem('token')
            navigate('/')
        } catch (error) {
            navigate('/error')
        }
        finally {
            ContextItems.setProgress(100)
        }
    }

    async function deleteAccount() {
        try {
            ContextItems.setProgress(10)
            const token = sessionStorage.getItem('token')
            const user = ContextItems.user._id
            ContextItems.setUser({})
            ContextItems.setCart([])
            ContextItems.setBookedProducts([])
            ContextItems.setCartCount(0)
            // const resp = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/delete`, { user: user })
            const deleteUser = await fetch(`http://localhost:8080/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'Application/json',
                },
                body: JSON.stringify({ user: user })
            })
            ContextItems.setProgress(50)
            const deleteUserParsed = await deleteUser.json()
            if (deleteUserParsed.success) {
                await sessionStorage.removeItem('token')
                navigate('/')
            }
            else {
                navigate('/error')
            }
        } catch (error) {
            console.log('C', error)
            navigate('/error')
        }
        finally {
            ContextItems.setProgress(100)
        }
    }

    return (
        <>
            {
                ContextItems.user &&
                <div className="profile-super-container">
                    <div className="profile-container">
                        <div className="profile-picture">
                            {ContextItems.user.username[0].toUpperCase()}
                        </div>
                        <div className="profile-data">
                            <div className="profile-data-head-value-container">
                                <div className='data-head'>Username: </div>
                                <div className="data-value">{ContextItems.user.username}</div>
                            </div>
                            <div className="profile-data-head-value-container">
                                <div className='data-head'>Email: </div>
                                <div className="data-value">{ContextItems.user.email}</div>
                            </div>
                            <div className="profile-data-head-value-container">
                                <div className='data-head'>Mobile: </div>
                                <div className="data-value">{ContextItems.user.mobile}</div>
                            </div>
                            <div className="profile-data-head-value-container">
                                <div className='data-head'>Address: </div>
                                <div className="data-value">{ContextItems.user.address}</div>
                            </div>
                            <div className="orders-books-container">
                                <div className="orders-container">
                                    <Link to="/orders" className='order-btn'>
                                        Orders
                                    </Link>
                                </div>
                                <div className="books-container">
                                    <Link className="books-btn" to="/cart">
                                        Cart
                                    </Link>
                                </div>
                            </div>
                            <div className="log-out-delete">
                                <div className="log-in-container">
                                    <button className='log-out-btn' onClick={logOut}>
                                        Log out
                                    </button>
                                </div>
                                <div className="delete-account-container">
                                    <button className="delete-account-btn" onClick={deleteAccount}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Profile