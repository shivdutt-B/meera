import React, { useState, createContext } from 'react'
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


    async function fetchProducts(productSetter) {
        const fetch = await axios("http://localhost:8080/products")
        productSetter(fetch.data.products)
        // console.log('iam fetching this', fetch)
        // setCartOfOrders(fetch.data.)
    }

    async function handleCartClick(e, element, user, navigate, setCartCount, setProgress, cart, setCart) {
        console.log('this is it cart click general', cart)
        if (Object.keys(user).length > 0) {
            // const svg = e.target.closest('.add-to-cart').children[0]
            // const svgPath = e.target.closest('.add-to-cart').children[0].children[2].children[0]
            // setProgress(10)

            // svg.style.transform = "scale(1.2)"

            // setTimeout(() => {
            //     svg.style.transform = "scale(1)"
            // }, 250)

            setProgress(30)

            const isItemInCart = cart.some((item) => {
                return item._id == element._id
            })

            if (isItemInCart) {
                console.log('this is it cart clik to remove', cart)
                const removeFromCart = await axios.post('http://localhost:8080/removefromcart', element)
                if (removeFromCart.data.success) {
                    setCartCount(removeFromCart.data.products.length)
                    // setCart(removeFromCart.data.cartItems)
                    // let products = cart.filter((item) => {item._id !== element._id})
                    setCart(removeFromCart.data.products)
                    console.log('IM IN ATHE CART', removeFromCart)
                    // console.log('now the cart',cart)
                }
            }
            else {
                console.log('this is it cart clik to add', cart)
                const addCart = await axios.post('http://localhost:8080/addtocart', element)
                console.log('adding cart', addCart)
                if (addCart.data.success) {
                    // setCartCount(addCart.data.length)
                    setCartCount(addCart.data.products.length)
                    // setCart(addCart.data.cartItems)
                    // setCart(cart.push(element))
                    setCart(addCart.data.products)
                    console.log('IM IN ATHE CART2', addCart)
                    console.log('now the cart', cart)
                }
            }



            setProgress(100)
        }

        else {
            navigate('/signin')
        }
    }

    async function deleteItem(element, setCartCount, setCount, setProgress, priceSetter) {
        setProgress(10)
        const addCart = await axios.post('http://localhost:8080/removefromcart', element)
        setCartCount(addCart.data.length)
        setProgress(30)
        const a = cart.filter((item) => {
            if (item._id != element._id) {
                return item
            }
        })
        setProgress(50)
        setCart(a)
        setCount(a.length)
        setProgress(100)

    }

    async function handleBookClick(e, element, user, navigate, setProgress,bookedProducts,setBookedProducts) {
        try {
            console.log('book function initilize')
            if (Object.keys(user).length > 0) {
                setProgress(10)
                setProgress(30)
                const isItemInBook = bookedProducts.some((item) => {
                    return item._id == element._id
                })
                
                if (isItemInBook){ //element is already present so need to remove it.
                    console.log('removing from book')
                    const removeProduct = await axios.post('http://localhost:8080/removefrombook', element)
                    if (removeProduct.data.status){
                        setBookedProducts(removeProduct.data.bookItems)
                    }
                }
                else{ //element is not in the book so we need to add it.
                    console.log('adding in book')
                    const addProduct = await axios.post('http://localhost:8080/addtobook', element) 
                    if (addProduct.data.status){
                        setBookedProducts(addProduct.data.bookItems)
                    }
                }
                console.log('booking completedd')
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
            console.log('iam in book2')
        }
        catch (error) {

        }
    }

    async function TransferData(element, navigate) {
        console.log('transfer data called')
        const elementData = JSON.stringify(element)
        await sessionStorage.setItem('productInfo', elementData)
        await sessionStorage.setItem('category', element.category)
        // navigate(`/product/id=${element._id}`)
        // navigate('/displayproduct')
    }



    return (
        <ContextName.Provider value={{
            cart, setCart, products, setProducts, user, setUser, fetchProducts, handleCartClick, deleteItem, toBeOrder, setToBeOrder, tempCart, setTempCart, cartOfOrders, setCartOfOrders, bookedProducts, setBookedProducts, handleBookClick, TransferData, cartCount, setCartCount
        }}>
            {props.children}
        </ContextName.Provider>
    )
}

export default ContextData