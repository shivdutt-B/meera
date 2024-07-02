import logo from './logo.svg';
import './App.css';
import Navbar from './Layouts/Navbar';
import Home from './Components/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import PaymentFailed from './Components/PaymentFailed';
import ErrorPage from './Components/ErrorPage';


function App() {
  const ContextItems = useContext(ContextName)
  const [user, setUser] = useState({})
  const [cartCount, setCartCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [cart, setCart] = useState([])
  const [bookedProducts, setBookedProducts] = useState([])
  const navigate = useNavigate()


  return (
    // <div className="App">
    <>
      <BrowserRouter>
        <ContextData>
          <TopLoadingBar />
          <Navbar cartCount={cartCount} setCartCount={setCartCount} cart={cart} />
          <Routes>
            <Route exact path="/" element={<Home user={user} cartCount={cartCount} setCartCount={setCartCount} setProgress={setProgress} cart={cart} setCart={setCart} setBookedProducts={setBookedProducts} bookedProducts={bookedProducts} />} setProgress={setProgress} />
            <Route path="/signin" element={<SignIn setCartCount={setCartCount} cart={cart} setCart={setCart} setBookedProducts={setBookedProducts} />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<Profile setCartCount={setCartCount} setBookedProducts={setBookedProducts} />} />
            <Route exact path="/:products" element={<Products cartCount={cartCount} setCartCount={setCartCount} setProgress={setProgress} />} />
            <Route exact path="/cart" element={<Cart setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/address" element={<Address setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/payment" element={<Payment setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/summary" element={<Summary setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/order" element={<Order setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/product" element={<Product setProgress={setProgress} setCartCount={setCartCount} />} />
            <Route exact path="/success" element={<PaymentSuccessfull />} />
            <Route exact path="/orders" element={<MyOrders setProgress={setProgress} />} />
            <Route exact path="/booked" element={<Booked bookedProducts={bookedProducts} setBookedProducts={setBookedProducts} setProgress={setProgress} />} />
            <Route exact path="/product/:id" element={<DisplayProduct setCartCount={setCartCount} setProgress={setProgress} setBookedProducts={setBookedProducts} bookedProducts={bookedProducts} />} />
            <Route exact path="/search/:query" element={<SearchResult />} />
            <Route exact path="/failed" element={<PaymentFailed />} />
            <Route exact path="/error" element={<ErrorPage />} />

          </Routes>
          <Footer />
        </ContextData>
      </BrowserRouter>
      </>
    // </div>
  )
}


export default App;
