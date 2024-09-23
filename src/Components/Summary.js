import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ContextName } from '../Context/Context'
import { Link } from 'react-router-dom'

function Summary(props) {


  const ContextItems = useContext(ContextName)
  const [cart, setCart] = useState({})
  const [count, setCount] = useState([])
  const [cost, setCost] = useState(0)

  async function getCart() {
    ContextItems.setProgress(10)
    const cart = await axios.get("http://localhost:8080/getCart")
    ContextItems.setCart(cart.data)
    ContextItems.setProgress(30)

    setCount(cart.data)
    priceSetter(cart.data)

    ContextItems.setProgress(100)
  }

  function priceSetter(cart) {
    let cost = 0
    cart.map((element) => {
      cost += (element.price * element.count * (1 - element.discountPercentage * element.count / 100)).toFixed(2)
      console.log()
      // cost += element.price * element.count
    })
    setCost(cost)
  }

  useEffect(() => {
    // getCart()
    console.log('CODE 22', JSON.parse(sessionStorage.getItem('toBeOrder')))
    const parsedData = JSON.parse(sessionStorage.getItem('toBeOrder'))
    priceSetter(parsedData)
  }, [])


  return (
    <div className="main">
      <div className="gutter">
        <div className="progress-event">
          <div className="event-dot-container">
            <div className="event-dot active-dot"></div>
            <div className="event-text">Order<br />Summary</div>
            <div className="event-line"></div>
          </div>
          <div className="event-dot-container">
            <div className="event-dot"></div>
            <div className="event-text">Payment<br />Method</div>
            <div className="event-line"></div>
          </div>
          <div className="event-dot-container">
            <div className="event-dot"></div>
            <div className="event-text">Place<br />Order</div>
          </div>
        </div>

        {
          // JSON.parse(sessionStorage.getItem('toBeOrder')).length > 0 &&
          <div className="cart-summary-container">
            <div className="cart">
              {
                JSON.parse(sessionStorage.getItem('toBeOrder')).map((element) => {
                  return (
                    <>
                      <div key={element._id} className="cart-item">
                        <div className="cart-item-poster">
                          <img src={element.thumbnail} alt="" />
                        </div>
                        <div className="cart-item-name summary-item-name">
                          <h3 style={{ fontSize: "17px" }}>{element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title}</h3>

                          {/* <div className="cart-item-count cart-item-count-small">
                            <div className="count-plus">
                              <span className="cart-item-count-span">{JSON.parse(sessionStorage.getItem('toBeOrder')).map((item) => { if (item._id == element._id) { return item.count } })}</span>
                            </div>
                          </div> */}

                        </div>
                        <div className="cart-item-count summary-price-count-container">
                          <div className="summary-item-price-container">
                            <i class="fas fa-dollar-sign"></i> {(Number(element.price) - ((Number(element.price) * Number(element.discountPercentage ? element.discountPercentage : 0)) / 100)).toFixed(2)}
                          </div>
                          <div className="count-plus">
                            <span className="cart-item-count-span">{JSON.parse(sessionStorage.getItem('toBeOrder')).map((item) => { if (item._id == element._id) { return `x${item.count}` } })}</span>
                          </div>
                        </div>

                        <div className="cart-item-price">
                          <div>
                            <i class="fas fa-dollar-sign"></i><span className="cart-item-price-span">{(element.price * element.count * (1 - element.discountPercentage * element.count / 100)).toFixed(2)}</span>
                          </div>

                          {/* <div className="cart-item-remove cart-item-remove-small">
                            <i class="fa-regular fa-trash-can" onClick={() => { deleteItem(element, props.setCartCount, ContextItems.setCount, ContextItems.setProgress) }}></i>
                          </div> */}

                        </div>
                        {/* <div className="cart-item-remove">
                          <i class="fa-regular fa-trash-can" onClick={() => { deleteItem(element, props.setCartCount, ContextItems.setCount, ContextItems.setProgress) }}></i>
                        </div> */}
                      </div>
                      <div className="cart-item-border-bottom"></div>
                    </>
                  )
                })
              }
            </div>
            <div className="summary-container">
              <h3>SUMMARY</h3>
              <div className="sub-total-container">
                <div className="sub-total-head">
                  <h4>Subtotal</h4>
                </div>
                <div className="sub-total-head">
                  <i class="fas fa-dollar-sign"></i>{cost.toFixed(2)}
                </div>
              </div>
              <div className="cart-item-border-bottom summary-border"></div>
              {/* <div className="grand-total-container">
                <div className="grand-total-head">
                  <h4>Grand</h4>
                </div>
                <div className="grand-total-head">
                  <i class="fas fa-dollar-sign"></i>{cost}
                </div>
              </div> */}
              <div className="checkout-btn-container">
                {
                  ContextItems.user.address ?
                    <div className="enter-address"> {ContextItems.user.address} </div> :
                    <Link to="/address" className="enter-address">
                      Enter Address
                    </Link>
                }
                {
                  ContextItems.user.address ?
                    <Link to="/payment" className="checkout-btn">
                      Place Order <i class="fa-solid fa-arrow-right"></i>
                    </Link> :
                    <Link to="/address" className="checkout-btn">
                      Place Order <i class="fa-solid fa-arrow-right"></i>
                    </Link>
                }
                <Link to="/" className="checkout-btn shopping-btn">
                  Keep Shopping <i class="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        }


      </div>
    </div>
  )
}

export default Summary