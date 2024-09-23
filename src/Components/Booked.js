import React,{useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ContextName } from '../Context/Context'
import Loading from './Loading'

function Booked(props) {
  const [cost, setCost] = useState(0)
  const ContextItems = useContext(ContextName)
  useEffect(() => {
    let cost = 0
    ContextItems.bookedProducts.map((element) => {
      cost += element.count * element.price
      setCost(cost)
      
    })
  })
  async function deleteItem(element){
    ContextItems.setProgress(30)
    const addCart = await axios.post('http://localhost:8080/removefrombook', element)
    ContextItems.setProgress(50)
    console.log('CODE 22',addCart)
    ContextItems.setBookedProducts(addCart.data.cartItems)
    ContextItems.setProgress(100)

  }
  return (
    <div className="main">
      <div className="gutter">
      {
        // !ContextItems.checkLoading ?
            ContextItems.bookedProducts.length > 0 ?
              <div className="cart-summary-container">
                <div className="cart">
                  {
                    ContextItems.bookedProducts.map((element) => {
                      return (
                        <>
                          <div key={element._id} className="cart-item">
                            <div className="cart-item-poster">
                              <img src={element.thumbnail} alt="" />
                            </div>
                            <div className="cart-item-name">
                                <h3 className="cart-item-name-name">{element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title}</h3>
                              </div>
                            <div className="cancel-order">
                              <div className="cancel-order-button">
                               <i class="fa-regular fa-trash-can" onClick={() => {deleteItem(element)}}></i>
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
                      <i class="fas fa-dollar-sign"></i>
                      {cost}
                    </div>
                  </div>
                  <div className="cart-item-border-bottom summary-border"></div>
                  <div className="grand-total-container">
                    <div className="grand-total-head">
                      <h4>Grand</h4>
                    </div>
                    <div className="grand-total-head">
                      <i class="fas fa-dollar-sign"></i>
                      {cost}
                    </div>
                  </div>
                  <div className="checkout-btn-container">
                  </div>
                </div>
              </div>
              :
              <div className="no-item-in-cart-poster-container">
                <Link className="no-item-in-cart-keep-shopping-btn" to="/" >Keep Shopping <i class="fa-solid fa-arrow-right"></i></Link>
              </div>
              // :
              // <Loading/>
        }
      </div>
    </div>
  )
}

export default Booked