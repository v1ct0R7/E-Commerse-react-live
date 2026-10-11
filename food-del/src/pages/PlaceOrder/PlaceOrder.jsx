import React, { useContext } from 'react'
import './PlaceOrder.css'
import '../Cart/Cart.css'
import { StoreContext } from '../../context/StoreContext'

const PLaceOrder = () => {

  const { getTotalCartAmount } = useContext(StoreContext)

  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multy-fields">
          <input type="text" placeholder='First Name' />
          <input type="text" placeholder='Lastname' />
        </div>
        <input type="email" placeholder='Email address' />
        <input type="text" placeholder='street' />
        <div className="multy-fields">
          <input type="text" placeholder='City' />
          <input type="text" placeholder='State' />
        </div>
        <div className="multy-fields">
          <input type="text" placeholder='Zip Code' />
          <input type="text" placeholder='Country' />
        </div>
        <input type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>Proceed to checkout</button>
        </div>
      </div>
    </form>
  )
}

export default PLaceOrder