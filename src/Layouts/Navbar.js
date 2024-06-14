import React, { useState, useEffect, useContext } from 'react'
import { showSearchBar } from "../Functions/NavbarFc"
import { Link } from 'react-router-dom'
import { ContextName } from '../Context/Context'
import axios from "axios"

function Navbar(props) {
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [cartCount, setCartCount] = useState(0)
    const [user, setUser] = useState({})

    const ContextItems = useContext(ContextName)

    async function fetchProducts() {
        const fetch = await axios("http://localhost:8080/auth")
        if (fetch.data.user) {
            ContextItems.setUser(fetch.data.user)
            ContextItems.setCart(fetch.data.user.cart)
            ContextItems.setBookedProducts(fetch.data.user.book)
            ContextItems.setCartCount(fetch.data.user.cart.length)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // useEffect(()=> {
    //     console.log('cart item changed',ContextItems.cartCount)
    // },[ContextItems.cartCount])

    function showSearchBar() {
        document.querySelector('.search-bar-small').classList.toggle('toggle-display')
    }
    function clearSearch() {
        setSearchValue('')
    }

    return (
        <>
            {
                // props.user.length > 0 &&
                <div className="nav">
                    <div className="nav-brand">
                        <Link to="/">MIRA</Link>
                    </div>

                    <div className="search-bar">
                        <form action="" className="search-bar-form">
                            <input type="text" value={searchValue} className="main-search-bar-input" onChange={(e) => { setSearchValue(e.target.value) }} placeholder="search your " />
                            <i class="fa-solid fa-xmark clear-search" onClick={clearSearch}></i>
                        </form>
                    </div>

                    <div className="nav-links">

                        <div className="nav-search-small" onClick={showSearchBar}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>

                        <div className="nav-cart">
                            <Link to="/cart" className="nav-cart-link">
                                {/* <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11 2C9.34315 2 8 3.34315 8 5V6.00038C7.39483 6.00219 6.86113 6.01237 6.41261 6.06902C5.8235 6.14344 5.25718 6.31027 4.76902 6.73364C4.28087 7.15702 4.03562 7.69406 3.87865 8.26672C3.73286 8.79855 3.63761 9.46561 3.52795 10.2335L3.51947 10.2929L2.65222 16.3636C2.50907 17.3653 2.38687 18.2204 2.38563 18.9086C2.38431 19.6412 2.51592 20.3617 3.03969 20.9656C3.56347 21.5695 4.25813 21.8017 4.98354 21.904C5.66496 22.0001 6.52877 22.0001 7.54064 22H16.4594C17.4713 22.0001 18.3351 22.0001 19.0165 21.904C19.7419 21.8017 20.4366 21.5695 20.9604 20.9656C21.4842 20.3617 21.6158 19.6412 21.6144 18.9086C21.6132 18.2204 21.491 17.3653 21.3478 16.3635L20.4721 10.2335C20.3625 9.46561 20.2672 8.79855 20.1214 8.26672C19.9645 7.69406 19.7192 7.15702 19.2311 6.73364C18.7429 6.31027 18.1766 6.14344 17.5875 6.06902C17.1389 6.01237 16.6052 6.00219 16 6.00038V5C16 3.34315 14.6569 2 13 2H11ZM14 6V5C14 4.44772 13.5523 4 13 4H11C10.4477 4 10 4.44772 10 5V6L14 6ZM9 8C9.55228 8 10 8.44772 10 9V11C10 11.5523 9.55228 12 9 12C8.44772 12 8 11.5523 8 11V9C8 8.44772 8.44772 8 9 8ZM16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9V11C14 11.5523 14.4477 12 15 12C15.5523 12 16 11.5523 16 11V9Z" fill="#ffffff"></path> </g></svg> */}
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                <span className="cart-items-count">{ContextItems.cartCount}</span>
                            </Link>
                        </div>

                        <div className="nav-start">
                        {/* {console.log('my user',props.user)} */}
                            {
                                Object.keys(ContextItems.user).length > 0 ?
                                    <Link to="/profile" className="nav-start-link nav-user-link">
                                        {ContextItems.user.username[0].toUpperCase()}
                                    </Link>
                                    :
                                    <>
                                        <Link to="/signup" className="nav-start-link nav-start-link-small">
                                            <i class="fa-solid fa-arrow-right-to-bracket"></i>
                                        </Link>
                                        <Link to="/signup" className="nav-start-link">Start <i class="fa-solid fa-arrow-right"></i>
                                        </Link>
                                    </>
                            }
                        </div>

                        <div className="search-bar search-bar-small">
                            <form action="" className="search-bar-form">
                                <input type="text" placeholder="search your " />
                                <i class="fa-solid fa-xmark cross-for-search-bar" onClick={showSearchBar}></i>
                            </form>
                        </div>

                    </div>
                </div>
            }
        </>
    )
}

export default Navbar