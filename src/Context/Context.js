import React, { useState, createContext, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

export const ContextName = createContext()

const ContextData = (props) => {

    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [user, setUser] = useState({})
    const [toBeOrder, setToBeOrder] = useState({})
    const [tempCart, setTempCart] = useState([])
    // const [cart, setCart] = useState({})
    // const [progress, setProgress] = useState(10)
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
        // setCheckLoading(true)
        // setProgress(100)
        if (products.length > 0) {

        }
        else {
            const fetch = await axios("http://localhost:8080/products")
            // console.log('*** FETCHING PRODUCTS ***', fetch)
            let products = fetch.data.products
            setProducts(products)
        }
        // setCheckLoading(false)
        // setProgress(100)
    }

    async function handleCartClick(e, element, user, navigate, setCartCount, setProgress, cart, setCart) {
        console.log('CART CLICKED FROM CONTEXT', cart)
        if (Object.keys(user).length > 0) {

            setProgress(30)

            const isItemInCart = cart.some((item) => {
                return item._id == element._id
            })

            console.log('CHECK IN CART', isItemInCart)

            if (isItemInCart) {
                const removeFromCart = await axios.post('http://localhost:8080/removefromcart', { "_id": element._id })
                console.log('code 239', removeFromCart)
                if (removeFromCart.data.success) {
                    setCartCount(removeFromCart.data.length)
                    let products = cart.filter((item) => { return item._id != element._id })
                    setCart(products)
                    priceSetter(products, setCartCost)
                    // setCart(removeFromCart.data.products)
                }
            }
            else {
                const addCart = await axios.post('http://localhost:8080/addtocart', element)
                console.log('res 434', addCart)
                if (addCart.data.success) {
                    setCartCount(addCart.data.length)
                    cart.push(element)
                }
            }



            setProgress(100)
        }

        else {
            navigate('/signin')
        }
    }

    async function deleteItem(element, setCartCount, setProgress, priceSetter) {
        setProgress(10)
        const removeFromCart = await axios.post('http://localhost:8080/removefromcart', { "_id": element._id })
        // setCartCount(addCart.data.length)
        setProgress(30)
        // const a = cart.filter((item) => {
        //     if (item._id != element._id) {
        //         return item
        //     }
        // })
        setProgress(50)
        setCartCount(removeFromCart.data.length)
        let products = cart.filter((item) => { return item._id != element._id })
        priceSetter(products, setCartCost)
        setCart(products)
        setProgress(100)

    }

    async function handleBookClick(e, element, user, navigate, setProgress, bookedProducts, setBookedProducts) {
        try {
            if (Object.keys(user).length > 0) {
                setProgress(10)
                setProgress(30)
                const isItemInBook = bookedProducts.some((item) => {
                    return item._id == element._id
                })

                if (isItemInBook) { //element is already present so need to remove it.
                    const removeProduct = await axios.post('http://localhost:8080/removefrombook', element)
                    if (removeProduct.data.status) {
                        setBookedProducts(removeProduct.data.bookItems)
                    }
                }
                else { //element is not in the book so we need to add it.
                    const addProduct = await axios.post('http://localhost:8080/addtobook', element)
                    if (addProduct.data.status) {
                        setBookedProducts(addProduct.data.bookItems)
                    }
                }
                setProgress(50)
                // if (bookMark.classList.contains('item-in-book')) {  // Removing from cart
                //     const addCart = await axios.post('http://localhost:8080/removefrombook', element)

                //     bookMark.classList.remove('item-in-book')
                //     setBookedProducts(addCart.data.cartItems)
                // }
                // else { // Adding item to cart
                //     const removeFromCart = await axios.post('http://localhost:8080/addtobook', element)
                //     bookMark.classList.add('item-in-book')
                //     setBookedProducts(removeFromCart.data.cartItems)
                // }

                setProgress(100)
            }
            else {
                navigate('/signin')
            }
        }
        catch (error) {

        }
    }

    async function TransferData(element, navigate) {
        const elementData = JSON.stringify(element)
        await sessionStorage.setItem('productInfo', elementData)
        await sessionStorage.setItem('productCategory', element.category)
        // navigate(`/product/${element._id}`)
    }

    function priceSetter(data, parameter) {
        let cost = 0
        // console.log('PARA', parameter)
        data.map((element) => {
            cost += element.count * (element.price * (1 - element.discountPercentage / 100)).toFixed(2)
        })
        parameter(cost)
    }

    async function fetchUser() {
        setProgress(10)
        if (Object.keys(user).length > 0) {
            // User is already present so no need to fetch again.
        }
        else {
            setCheckLoading(true)
            const fetch = await axios("http://localhost:8080/auth")
            // console.log('*** FETCHING USER ***', fetch)
            setProgress(50)
            // Output: {user: user{}, products: product[]}
            if (fetch.data.user) {
                //Setting all the information from user
                setUser(fetch.data.user)
                setCart(fetch.data.user.cart)
                setOrder(fetch.data.user.order)
                setBookedProducts(fetch.data.user.book)
                setCartCount(fetch.data.user.cart.length)

                // Setting all the prices (cart, order)
                priceSetter(fetch.data.user.cart, setCartCost) // calculating total price of all the items in cart.
                priceSetter(fetch.data.user.order, setOrderCost) // calculating total price of all the items in order.
                setCheckLoading(false)
            }
        }
        setProgress(100)
    }


    useEffect(() => {
        fetchProducts()
        fetchUser()
    }, [])


    return (
        <ContextName.Provider value={{
            cart, setCart, products, setProducts, user, setUser, fetchProducts, handleCartClick, deleteItem, toBeOrder, setToBeOrder, tempCart, setTempCart, cartOfOrders, setCartOfOrders, bookedProducts, setBookedProducts, handleBookClick, TransferData, cartCount, setCartCount, order, setOrder, cartCost, setCartCost, orderCost, setOrderCost, checkLoading, setCheckLoading, progress, setProgress, categoryData, setCategoryData, relatedProducts, setRelatedProducts, priceSetter, currentQuery, setCurrentQuery
        }}>
            {props.children}
        </ContextName.Provider>
    )
}

export default ContextData