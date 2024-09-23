import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ContextName } from '../Context/Context'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import EmptyCart from "../Assets/empth-cart.png"
import Loading from './Loading'

function Cart(props) {
  const ContextItems = useContext(ContextName)
  const [cart, setCart] = useState({})
  const [count, setCount] = useState([])
  const [cost, setCost] = useState(0)
  const navigate = useNavigate()
  const [checkLoad, setCheckLoad] = useState(true)

  async function getCart() {
    if (ContextItems.cart.length > 0) {
      // Cart is already present no need to fetch again.
      priceSetter(ContextItems.cart)
    }
    else {
      if (Object.keys(ContextItems.user).length > 0) {
        ContextItems.setProgress(10)
        const cart = await axios.get("http://localhost:8080/getCart")
        console.log('code 212', cart)
        ContextItems.setCart(cart.data)
        ContextItems.setProgress(30)

        setCount(cart.data)
        priceSetter(cart.data)

        ContextItems.setProgress(100)
      }
    }
  }

  async function increaseItem(e, element) {
    ContextItems.setProgress(0)
    const response = await axios.post(`http://localhost:8080/increaseitem`, { productId: element._id })
    ContextItems.setProgress(50)

    let price = e.target.closest('.cart-item').querySelector('.cart-item-price-span')
    let count = e.target.parentElement.children[1]

    count.innerHTML = Number(count.innerHTML) + 1
    // price.innerHTML = element.price * Number(count.innerHTML)
    price.innerHTML = ((element.price * (1 - element.discountPercentage / 100)) * Number(count.innerHTML)).toFixed(2)
    // (item.price * (1 - item.discountPercentage / 100)).toFixed(2)

    ContextItems.setProgress(100)
    console.log('response', response)
    ContextItems.priceSetter(response.data, ContextItems.setCartCost)
  }

  async function decreaseItem(e, element) {
    ContextItems.setProgress(0)
    const response = await axios.post(`http://localhost:8080/decreaseitem`, { productId: element._id })
    console.log('CODE 2xx', response)
    ContextItems.setProgress(50)

    let price = e.target.closest('.cart-item').querySelector('.cart-item-price-span')
    let count = e.target.parentElement.children[1]

    if (count.innerHTML == 1) {
      // ContextItems.deleteItem(element, ContextItems.setCartCount, setCount, ContextItems.setProgress)
      ContextItems.handleCartClick(e, element, ContextItems.user, navigate, ContextItems.setCartCount, ContextItems.setProgress, ContextItems.cart, ContextItems.setCart)
    }
    else {
      count.innerHTML = Number(count.innerHTML) - 1
      price.innerHTML = ((element.price * (1 - element.discountPercentage / 100)) * Number(count.innerHTML)).toFixed(2)
    }
    ContextItems.priceSetter(response.data, ContextItems.setCartCost)
    ContextItems.setProgress(100)
  }

  async function deleteItem(element) {
    console.log('CLICKED DELTE')
    ContextItems.setProgress(10)
    const addCart = await axios.post('http://localhost:8080/removefromcart', element)
    ContextItems.setProgress(30)
    ContextItems.setProgress(50)
    console.log('code 56', addCart.data)
    ContextItems.priceSetter(addCart.data.products, ContextItems.setCartCost)
    ContextItems.setCart(addCart.data.products) // context
    ContextItems.setCartCount(addCart.data.products.length)
    ContextItems.setProgress(100)
  }

  function priceSetter(cart) {
    let cost = 0
    cart.map((element) => {
      cost += element.price * element.count
    })
    ContextItems.setCartCost(cost.toFixed(2))
  }


  function setToBeOrder() {
    console.log('things to order', ContextItems.cart)
    if (ContextItems.cart.length > 0) {
      sessionStorage.setItem('toBeOrder', JSON.stringify(ContextItems.cart))
    }
    else {
      sessionStorage.setItem('toBeOrder', JSON.stringify([ContextItems.cart]))
    }
    navigate('/summary')
  }

  useEffect(() => {
    // getCart()
    ContextItems.priceSetter(ContextItems.cart, ContextItems.setCartCost)
  }, [])


  return (
    <div className="main">
      <div className="gutter">
        {
          ContextItems.cart.length > 0 ?
            <div className="cart-summary-container">
              <div className="cart">
                {
                  ContextItems.cart.map((element) => {
                    return (
                      <>
                        <div key={element._id} className="cart-item" onClick={() => { ContextItems.TransferData(element, navigate) }}>
                          <div className="cart-item-poster">
                            <img src={element.thumbnail} alt="" />
                          </div>
                          <div className="cart-item-name">
                            <h3 className="cart-item-title">{element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title}</h3>
                            <h3 className="cart-item-title-small">{element.title.length > 30 ? element.title.slice(0, 15) + '...' : element.title}</h3>

                            {/* <div className="cart-item-count cart-item-count-small">
                                <div className="count-plus">
                                  <i className="fas fa-plus" onClick={(e) => { increaseItem(e, element) }}></i>
                                  <span className="cart-item-count-span">{count.map((item) => { if (item._id == element._id) { return item.count } })}5</span>
                                  <i className="fas fa-minus" onClick={(e) => { decreaseItem(e, element) }}></i>
                                </div>
                              </div> */}
                          </div>
                          <div className="cart-item-count">
                            <div className="count-plus">
                              <i className="fas fa-plus count-i" onClick={(e) => { increaseItem(e, element) }}></i>
                              <span className="cart-item-count-span">{element.count}</span>
                              <i className="fas fa-minus count-i" onClick={(e) => { decreaseItem(e, element) }}></i>
                            </div>
                            <div className="cart-item-price-small">
                              <i class="fas fa-dollar-sign"></i><span className="cart-item-price-span">{(element.price * element.count * (1 - element.discountPercentage * element.count / 100)).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="cart-item-price">
                            <div>
                              <i class="fas fa-dollar-sign"></i><span className="cart-item-price-span">{(element.price * element.count * (1 - element.discountPercentage * element.count / 100)).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="cart-item-remove-container">
                            <div className="cart-item-remove">
                              <i class="fa-regular fa-trash-can" onClick={(e) => { deleteItem(element) }}></i>
                            </div>
                            <div className="cart-item-remove-small" onClick={(e) => { deleteItem(element) }}>
                              Delete
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
                    <i class="fas fa-dollar-sign"></i>{ContextItems.cartCost.toFixed(2)}
                  </div>
                </div>
                <div className="cart-item-border-bottom summary-border"></div>
                <div className="grand-total-container">
                  {/* <div className="grand-total-head">
                      <h4>Grand</h4>
                    </div>
                    <div className="grand-total-head">
                      <i class="fas fa-dollar-sign"></i>{cost}
                    </div> */}
                </div>
                <div className="checkout-btn-container">
                  {
                    ContextItems.user.address ?
                      <div className="enter-address"> {ContextItems.user.address} </div> :
                      <Link to="/address" className="enter-address">
                        Enter Address to proceed
                      </Link>
                  }
                  {
                    ContextItems.user.address ?
                      <div className="checkout-btn" onClick={setToBeOrder}>
                        Place Order <i class="fa-solid fa-arrow-right"></i>
                      </div>
                      :
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
            :
            <div className="no-item-in-cart-poster-container">
              <img className="no-item-in-cart-poster" src={EmptyCart} />
              <Link className="no-item-in-cart-keep-shopping-btn" to="/" >Keep Shopping <i class="fa-solid fa-arrow-right"></i></Link>
            </div>
        }
      </div>
    </div>
  )
}

export default Cart