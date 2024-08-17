import React from 'react'
import { useContext } from 'react'
import { ContextName } from '../Context/Context'
import { useNavigate } from 'react-router-dom'

function Payment() {
    const navigate = useNavigate()
    const ContextItems = useContext(ContextName)


    async function payment() {
        try {
            console.log('code 1')
            ContextItems.setProgress(10)
            const token = sessionStorage.getItem('token')
            let itemsToOrder = JSON.parse(sessionStorage.getItem('toBeOrder'))
            let modItems = itemsToOrder.map(item => {
                return {
                    _id: item._id,
                    title: item.title,
                    price:
                        parseFloat((Number(item.price) - ((Number(item.price) * Number(item.discountPercentage ? item.discountPercentage : 0)) / 100)).toFixed(2)),
                    count: parseInt(item.count)
                }
            })
            const payLoad = {
                modItems
            }
            const payment = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payLoad)
            })
            const parsedPayment = await payment.json()
            console.log('PARSED: ', parsedPayment)
            window.location = parsedPayment.url
        } catch (error) {
            console.log('ERROR: ', error)
            // navigate('/error')
        } finally {
            ContextItems.setProgress(100)
        }
    }



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
                </div>
            </div>
        </div>
    )
}

export default Payment