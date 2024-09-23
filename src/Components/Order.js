import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ContextName } from '../Context/Context'
import { Link } from 'react-router-dom'

function Order(props) {
  const ContextItems = useContext(ContextName)
  const [cart, setCart] = useState({})
  const [count, setCount] = useState([])
  const [cost, setCost] = useState(0)

  async function getCart() {
    console.log("THIS IS A WRONG FUNCTION")
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
      cost += element.price * element.count
    })
    setCost(cost)
  }

  useEffect(() => {
    getCart()
  }, [])
  
  return (
    <div className="main">
      <div className="gutter">
        {
          count.length > 0 &&
          <div className="cart-summary-container">
            <div className="cart">
              {
                count.map((element) => {
                  return (
                    <>
                      <div key={element._id} className="cart-item">
                        <div className="cart-item-poster">
                          <img src={element.thumbnail} alt="" />
                        </div>
                        <div className="cart-item-name">
                          <h3>{element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title}</h3>

                          <div className="cart-item-count cart-item-count-small">
                            <div className="count-plus">
                              <span className="cart-item-count-span">{count.map((item) => { if (item._id == element._id) { return item.count } })}</span>
                            </div>
                          </div>

                        </div>
                        <div className="cart-item-count">
                          <div className="count-plus">
                            <span className="cart-item-count-span">{count.map((item) => { if (item._id == element._id) { return item.count } })}</span>
                          </div>
                        </div>

                        <div className="cart-item-price">
                          <div>
                            <i class="fas fa-dollar-sign"></i><span className="cart-item-price-span">{element.price * element.count}</span>
                          </div>
                        </div>
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
                  <i class="fas fa-dollar-sign"></i>{cost}
                </div>
              </div>
              <div className="cart-item-border-bottom summary-border"></div>
              <div className="grand-total-container">
                <div className="grand-total-head">
                  <h4>Grand</h4>
                </div>
                <div className="grand-total-head">
                  <i class="fas fa-dollar-sign"></i>{cost}
                </div>
              </div>
              <div className="checkout-btn-container">
                {
                  ContextItems.user.address ?
                    <Link to="/profile" className="checkout-btn">
                      Orders <i class="fa-solid fa-arrow-right"></i>
                    </Link> :
                    <Link to="/profile" className="checkout-btn">
                      Orders <i class="fa-solid fa-arrow-right"></i>
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

export default Order