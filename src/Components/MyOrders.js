import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContextName } from '../Context/Context'
import { useContext } from 'react'
import Loading from "./Loading"
import EmptyCart from "../Assets/empth-cart.png"

function MyOrders(props) {
  const ContextItems = useContext(ContextName)
  const [data, updateData] = useState([])
  const [cost, setCost] = useState(0)
  const [checkLoad, setCheckLoad] = useState(false)
  const COntextItems = useContext(ContextName)
  const navigate = useNavigate()

  async function getOrders() {
    console.log('CHECK 111', Object.keys(COntextItems.user).length > 0)
    console.log('CHECK 222', ContextItems.order.length > 0)
    if (Object.keys(ContextItems.user).length > 0) {
      if (ContextItems.order.length > 0) {
        console.log('PRICE SETTER UPPER')
        priceSetter(ContextItems.order)
      }
      else {
        // setCheckLoad(false)
        // const data = await axios.get('http://localhost:8080/order')
        // ContextItems.setOrder(data.data)
        // priceSetter(data.data)
        // setCheckLoad(true)
      }
    }
  }

  // useEffect(() => {
  //   getOrders()
  // }, [])

  function priceSetter(data) {
    console.log('PIRCE SETTER CALLED CODE 223')
    let cost = 0

    data.map((element) => {
      cost += element.count * element.price
    })
    setCost(cost)
  }

  async function deleteItem(element) {
    ContextItems.setProgress(10)
    const productId = element._id
    const deletedItem = await axios.post('http://localhost:8080/removefromorder', { productId: productId }) // deleted from db
    console.log('DELETED ITEM', deletedItem)
    ContextItems.setOrder(deletedItem.data.orders.order)
    ContextItems.setProgress(100)
  }



  return (
    <div className="main">
      <div className="gutter">
        {
          ContextItems.order.length > 0 ?
            <div className="cart-summary-container">
              <div className="cart">
                {
                  ContextItems.order.map((element) => {
                    return (
                      <>
                        <Link key={element._id} className="cart-item" onClick={() => { ContextItems.TransferData(element, navigate) }} to={`/product/${element._id}`}>
                          <div className="cart-item-poster">
                            <img src={element.thumbnail} alt="" />
                          </div>
                          <div className="cart-item-name order-item-name">
                            <h3 className="cart-item-name-name">{element.title.length > 30 ? element.title.slice(0, 30) + '...' : element.title}</h3>
                          </div>
                          <div className="cart-item-name-small order-item-name-small">
                            <h3 className="cart-item-name-name">{element.title.length > 30 ? element.title.slice(0, 20) + '...' : element.title}</h3>
                          </div>
                          <div className="cancel-order">
                            <div className="cancel-order-button">
                              <i class="fa-regular fa-trash-can" onClick={() => { deleteItem(element) }}></i>
                            </div>
                            <div className="cancel-order-button-small" onClick={() => { deleteItem(element) }}>
                              Cancel
                            </div>
                          </div>

                        </Link>
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
                    {ContextItems.orderCost.toFixed(2)}
                  </div>
                </div>
                <div className="checkout-btn-container">
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

export default MyOrders