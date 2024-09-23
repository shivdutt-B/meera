import logo from './logo.svg';
import './App.css';
import Navbar from './Layouts/Navbar';
import Home from './Components/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './Components/Signin';
import SignUp from './Components/Signup';
import axios from "axios"
import { useState, useEffect, useContext } from "react"
import ContextData from './Context/Context'
import { ContextName } from './Context/Context';
import Profile from './Components/Profile';
import Products from './Components/Products';
import createContext from 'react'
import LoadingBar from 'react-top-loading-bar'
import Cart from './Components/Cart';
import Address from './Components/Address';
import Payment from './Components/Payment';
import Summary from './Components/Summary';
import Order from './Components/Order';
import Product from "./Components/ProductView"
import PaymentSuccessfull from './Components/PaymentSuccessfull';
import MyOrders from './Components/MyOrders';
import Booked from './Components/Booked';
import DisplayProduct from './Components/DisplayProduct';
import Loading from './Components/Loading';
import TopLoadingBar from './Components/TopLoadingBar';
import Footer from './Components/Footer';
import SearchResult from './Components/SearchResult';
import TestingComp from './Components/TestingComp';
import PaymentFailed from './Components/PaymentFailed';
// import Cancel from './Components/Cancel';


function App() {
  const ContextItems = useContext(ContextName)
  const [user, setUser] = useState({})
  const [cartCount, setCartCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [cart, setCart] = useState([])
  const [bookedProducts, setBookedProducts] = useState([])

  // async function fetchProducts() {
  //   const fetch = await axios("http://localhost:8080/auth")
  //   console.log('fetch',fetch)
  //   ContextItems.setUser(fetch.data.user)
  //   ContextItems.setCart(fetch.data.user.cart)
  // }

  // useEffect(() => {
  //   console.log('flag app')
  //   fetchProducts()
  // }, [])



  // const ContextItems = useContext(ContextName)

  async function fetchProducts() {
    console.log('app.js')
    const fetch = await axios("http://localhost:8080/auth")
    // console.log("******************")

    console.log('FETCH', fetch)
    const user = fetch.data.user
    const cart = fetch.data.user.cart
    const book = fetch.data.user.book
    // console.log('USER1: ' ,ContextItems.user , 'CART: ' ,ContextItems.cart , 'BOOK: ' ,ContextItems.bookedProducts)

    // ContextItems.setUser(user)
    if (fetch.data.user) {
      const cartCount = fetch.data.user.cart.length
      setUser(user)
      setCartCount(cartCount)
      setCart(fetch.data.user.cart)
      // await ContextItems.setCart(ContextItems.cart.concat(cart))
      await ContextItems.setBookedProducts(book)
      await ContextItems.setCart(cart)
      await ContextItems.setUser(fetch.data.user)
      console.log('USER: ', ContextItems.user, 'CART: ', ContextItems.cart, 'BOOK: ', ContextItems.bookedProducts)
    }

  }

  useEffect(() => {
    // fetchProducts()
    // console.log('app.js')
  }, [])

  return (
    <div className="App">
      <ContextData>
        <TopLoadingBar />
        <BrowserRouter>
          <Navbar cartCount={cartCount} setCartCount={setCartCount} cart={cart} />
          <Routes>
            <Route path="/" element={<Home user={user} cartCount={cartCount} setCartCount={setCartCount} setProgress={setProgress} cart={cart} setCart={setCart} setBookedProducts={setBookedProducts} bookedProducts={bookedProducts} />} setProgress={setProgress} />
            <Route path="/signin" element={<SignIn setCartCount={setCartCount} cart={cart} setCart={setCart} setBookedProducts={setBookedProducts} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile setCartCount={setCartCount} setBookedProducts={setBookedProducts} />} />
            {/* <Route path="/products" element={<Products cartCount={cartCount} setCartCount={setCartCount} setProgress={setProgress} />} /> */}
            <Route path="/:products" element={<Products cartCount={cartCount} setCartCount={setCartCount} setProgress={setProgress} />} />
            <Route path="/cart" element={<Cart setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/address" element={<Address setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/payment" element={<Payment setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/summary" element={<Summary setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/order" element={<Order setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/product" element={<Product setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route path="/success" element={<PaymentSuccessfull />} />
            <Route path="/orders" element={<MyOrders setProgress={setProgress} />} />
            <Route path="/booked" element={<Booked bookedProducts={bookedProducts} setBookedProducts={setBookedProducts} setProgress={setProgress} />} />
            <Route exact path="/product/:id" element={<DisplayProduct setCartCount={setCartCount} setProgress={setProgress} setBookedProducts={setBookedProducts} bookedProducts={bookedProducts} />} />
            <Route exact path="/search/:query" element={<SearchResult />} />
            <Route exact path="/testing" element={<TestingComp />} />
            <Route path="/failed" element={<PaymentFailed />} />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </ContextData>
    </div>
  )
}


export default App;
