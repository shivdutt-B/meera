import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ContextName } from '../Context/Context'
import { Link } from 'react-router-dom'
import Loading from './Loading'

function Payment(props) {
    const ContextItems = useContext(ContextName)
    const [cart, setCart] = useState({})
    const [count, setCount] = useState([])
    const [cost, setCost] = useState(0)
    // let cost = 0

    async function getCart() {
        ContextItems.setProgress(10)
        const cart = await axios.get("http://localhost:8080/getCart")
        ContextItems.setCart(cart.data) // here
        ContextItems.setProgress(30)

        setCount(cart.data)
        priceSetter(cart.data)

        ContextItems.setProgress(100)
    }

    function priceSetter(cart) {
        let cost = 0
        cart.map((element) => {
            cost += element.price * element.count
        })
        setCost(cost)
    }

    async function payment() {
        ContextItems.setProgress(10)
        let itemsToOrder = JSON.parse(sessionStorage.getItem('toBeOrder'))
        const payment = await axios.post("http://localhost:8080/payment", itemsToOrder)
        ContextItems.setProgress(100)
        console.log('CODE 21', payment)
        window.location = payment.data.url
    }





    useEffect(() => {
        // getCart()
        // priceSetter(ContextItems.toBeOrder)
    }, [])


    return (
        <div className="main">
            <div className="gutter">
                <div className="progress-event">
                    <div className="event-dot-container">
                        <div className="event-dot active-dot"></div>
                        <div className="event-text">Order<br />Summary</div>
                        <div className="event-line active-line"></div>
                    </div>
                    <div className="event-dot-container active-dot-container">
                        <div className="event-dot active-dot"></div>
                        <div className="event-text">Payment<br />Method</div>
                        <div className="event-line"></div>
                    </div>
                    <div className="event-dot-container">
                        <div className="event-dot"></div>
                        <div className="event-text">Place<br />Order</div>
                    </div>
                </div>
                <h2 className="payment-heading">Choose Payment Method</h2>
                <div className="payment-method-container">
                    <div className="online-payment">
                        <div onClick={payment} className="online-payment-head">
                            <h4>Credit cart/Debit cart <i class="fa-solid fa-arrow-right"></i></h4>
                            <p>
                                pay online through various payment methods
                            </p>
                        </div>
                    </div>
                    <div></div>
                    {/* <div className="cash-on-delivery">
                        <Link to="/order">
                            <h4>Cash on delivery <i class="fa-solid fa-arrow-right"></i></h4>
                            <p>
                                Pay when you receive the item
                            </p>
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Payment