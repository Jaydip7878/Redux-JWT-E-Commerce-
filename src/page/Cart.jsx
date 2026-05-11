import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromCart, updateQuantity, clearCart, placeOrder } from '../features/cartSlice'
import { increaseStock, decreaseStock } from '../features/productsSlice'
import './cart.css'

const RAZORPAY_KEY = 'rzp_test_SlbdYuyzUmiZSn'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true)
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state) => state.cart)
  const userData = useSelector((state) => state.auth.userData)

  const handleQuantityChange = (id, newQuantity) => {
    const cartItem = items.find(item => item.id === id)
    if (cartItem) {
      const difference = cartItem.quantity - newQuantity
      if (difference > 0) {
        dispatch(increaseStock({ productId: id, quantity: difference }))
      } else if (difference < 0) {
        dispatch(decreaseStock({ productId: id, quantity: Math.abs(difference) }))
      }
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemove = (id) => {
    const cartItem = items.find(item => item.id === id)
    if (cartItem) {
      dispatch(increaseStock({ productId: id, quantity: cartItem.quantity }))
    }
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    items.forEach(item => {
      dispatch(increaseStock({ productId: item.id, quantity: item.quantity }))
      console.log(item.id)
    })
    dispatch(clearCart())
  }

  const calculateTax = () =>
  {
    if (items.length === 0) return 0
    const isAllGroceries = items.every((item) => item.category === "groceries")
    const taxRate = isAllGroceries ? 0.05 : 0.18
    return Number((totalPrice * taxRate).toFixed(2))
  }

  const tax = calculateTax()
  const grandTotal = totalPrice + tax

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty. Add a product first.')
      return
    }

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      alert('Unable to load Razorpay checkout. Please check your internet connection.')
      return
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(grandTotal * 100),
      currency: 'INR',
      name: 'Demo Shop',
      description: 'Order payment',
      image: 'https://assets.razorpay.com/images/rzp.png',
      handler: function (response) {
        if (response?.razorpay_payment_id) {
          dispatch(placeOrder({ paymentId: response.razorpay_payment_id, userData }))
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`)
          navigate('/orders')
        } else {
          alert('Payment completed, but no payment ID was returned.')
        }
      },
      prefill: {
        name: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'Guest User',
        email: userData?.email || '',
        contact: userData?.phone || '9999999999',
      },
      notes: {
        order_items: items.map((item) => `${item.title} x${item.quantity}`).join(', '),
      },
      theme: {
        color: '#0891b2',
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>🛒 Shopping Cart</h2>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="product-info">
                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="cart-product-thumb"
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          )}
                          <div>
                            <p className="product-name">{item.title}</p>
                            <p className="product-category">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="qty-btn"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                            }
                            min="1"
                            className="qty-input"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>

                <button onClick={handleCheckout} className="btn-checkout">
                  Pay with Razorpay
                </button>
                <button onClick={() => navigate('/products')} className="btn-continue">
                  Continue Shopping
                </button>
                <button onClick={handleClearCart} className="btn-clear">
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
