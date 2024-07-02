import './App.css';
import Navbar from './Layouts/Navbar';
import Home from './Components/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import SignIn from './Components/Signin';
import SignUp from './Components/Signup';
import ContextData from './Context/Context'
import Profile from './Components/Profile';
import Products from './Components/Products';
import Cart from './Components/Cart';
import Address from './Components/Address';
import Payment from './Components/Payment';
import Summary from './Components/Summary';
import PaymentSuccessfull from './Components/PaymentSuccessfull';
import MyOrders from './Components/MyOrders';
import DisplayProduct from './Components/DisplayProduct';
import TopLoadingBar from './Components/TopLoadingBar';
import Footer from './Components/Footer';
import SearchResult from './Components/SearchResult';
import PaymentFailed from './Components/PaymentFailed';
import ErrorPage from './Components/ErrorPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ContextData>
          <TopLoadingBar />
          <Navbar />
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/signin" element={<SignIn  />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/address" element={<Address />} />
            <Route exact path="/payment" element={<Payment />} />
            <Route exact path="/summary" element={<Summary />} />
            <Route exact path="/:products" element={<Products />} /> 
            <Route exact path="/success" element={<PaymentSuccessfull />} />
            <Route exact path="/orders" element={<MyOrders />} />
            <Route exact path="/product/:id" element={<DisplayProduct />} />
            <Route exact path="/search/:query" element={<SearchResult />} />
            <Route exact path="/failed" element={<PaymentFailed />} />
            <Route exact path="/error" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </ContextData>
      </BrowserRouter>
    </div>
  )
}


export default App;
