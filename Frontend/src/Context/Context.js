import React, { useState, createContext, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'


export const ContextName = createContext()

const ContextData = (props) => {
    const navigate = useNavigate()
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [user, setUser] = useState(false)
    const [toBeOrder, setToBeOrder] = useState({})
    const [tempCart, setTempCart] = useState([])
    const [cartOfOrders, setCartOfOrders] = useState({})
    const [bookedProducts, setBookedProducts] = useState([])
    const [cartCount, setCartCount] = useState(0)
    const [order, setOrder] = useState([])
    const [cartCost, setCartCost] = useState(0)
    const [orderCost, setOrderCost] = useState(0)
    const [checkLoading, setCheckLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [categoryData, setCategoryData] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])
    const [currentQuery, setCurrentQuery] = useState('')

    async function fetchProducts() {
        try {
            if (products.length > 0) {

            }
            else {
                const fetch = await axios(`${process.env.REACT_APP_BACKEND_BASE_URL}/products`)
                if (fetch.data.success) {
                    let products = fetch.data.products
                    setProducts(products)
                }
                else {
                }
            }
        } catch (error) {
            navigate('/error')
        }
    }

    async function handleCartClick(e, element, user, navigate, setCartCount, setProgress, cart, setCart) {
        try {
            console.log('CLICKED ')
            if (Object.keys(user).length > 0) {

                setProgress(30)

                const token = await sessionStorage.getItem('token')

                const isItemInCart = cart.some((item) => {
                    return item._id == element._id
                })

                if (isItemInCart) {

                    const removeFromCart = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/removefromcart`, {
                        method: 'POST', 
                        headers: {
                            'Authorization': `Bearer ${token}`, 
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({ "_id": element._id })
                    })
                    const parsedRemoveFromCart = await removeFromCart.json()
                    if (parsedRemoveFromCart.success) {
                        setCartCount(parsedRemoveFromCart.length)
                        let products = cart.filter((item) => { return item._id != element._id })
                        setCart(products)
                        priceSetter(products, setCartCost)
                    }
                }
                else {
                    console.log('ADD THIS ITEM: ', element)
                    const addToCart = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/addToCart`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include JWT in the Authorization header
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ element })
                    })
                    const addToCartParsed = await addToCart.json()
                    console.log('Code 88', addToCartParsed)
                    if (addToCartParsed.success) {
                        setCartCount(addToCartParsed.length)
                        cart.push(element)
                    }
                    // const addCart = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/addtocart`, element)
                    // if (addCart.data.success) {
                    //     setCartCount(addCart.data.length)
                    //     cart.push(element)
                    // }
                }
            }

            else {
                navigate('/signin')
            }
        } catch (error) {
            // navigate('/error')
        }
        finally {
            setProgress(100)
        }
    }

    async function deleteItem(element, setCartCount, setProgress, priceSetter, navigate) {
        try {
            setProgress(10)
            const token = sessionStorage.getItem('token')
            const removeFromCart = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/removefromcart`, {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ "_id": element._id })
            })
            const parsedRemoveFromCart = await removeFromCart.json()
            setProgress(50)
            if (parsedRemoveFromCart.success) {
                setCartCount(parsedRemoveFromCart.length)
                let products = cart.filter((item) => { return item._id != element._id })
                priceSetter(products, setCartCost)
                setCart(products)
            } else {
                navigate('/error')
            }
        } catch (error) {
            navigate('/error')
        }
        finally {
            setProgress(100)
        }

    }

    async function TransferData(element, navigate) {
        try {
            const elementData = JSON.stringify(element)
            await sessionStorage.setItem('productInfo', elementData)
            await sessionStorage.setItem('productCategory', element.category)
        } catch (error) {
            navigate('/error')
        }
    }

    function priceSetter(data, parameter) {
        let cost = 0
        data.map((element) => {
            cost += element.count * (element.price * (1 - element.discountPercentage / 100)).toFixed(2)
        })
        parameter(cost)
    }

    async function fetchUser() {
        setProgress(10)
        console.log('HII THERE')
        try {
            if (Object.keys(user).length > 0) {
                // User is already present so no need to fetch again.
            }
            else {
                // User is not there in the state so need to fetch it.
                setCheckLoading(true)
                const token = await sessionStorage.getItem('token')
                if (token) {
                    // We have signed in atleast once during the session so we have have the token in the session storage. The token can be used to fetch users information.
                    // const fetch = await axios(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth`)
                    const fetchUser = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    const parsedFetch = await fetchUser.json()
                    console.log('CODE 1', parsedFetch)
                    setProgress(50)
                    if (parsedFetch.user) {
                        // Setting all the information from user
                        setUser(parsedFetch.user)
                        setCart(parsedFetch.user.cart)
                        setOrder(parsedFetch.user.order)
                        setBookedProducts(parsedFetch.user.book)
                        setCartCount(parsedFetch.user.cart.length)

                        // Setting all the prices (cart, order)
                        priceSetter(parsedFetch.user.cart, setCartCost) // calculating total price of all the items in cart.
                        priceSetter(parsedFetch.user.order, setOrderCost) // calculating total price of all the items in order.
                        setCheckLoading(false)
                    }

                }
                else {
                    // User didn't sign in during the whole session so we don't have the token.
                }
            }
        } catch (error) {
            console.log('HEELOO', error)
            navigate('/error')
        }
        finally {
            setProgress(100)
        }
    }


    useEffect(() => {
        fetchProducts()
        fetchUser()
    }, [])


    return (
        <ContextName.Provider value={{
            cart, setCart, products, setProducts, user, setUser, fetchProducts, handleCartClick, deleteItem, toBeOrder, setToBeOrder, tempCart, setTempCart, cartOfOrders, setCartOfOrders, bookedProducts, setBookedProducts, TransferData, cartCount, setCartCount, order, setOrder, cartCost, setCartCost, orderCost, setOrderCost, checkLoading, setCheckLoading, progress, setProgress, categoryData, setCategoryData, relatedProducts, setRelatedProducts, priceSetter, currentQuery, setCurrentQuery
        }}>
            {props.children}
        </ContextName.Provider>
    )
}

export default ContextData