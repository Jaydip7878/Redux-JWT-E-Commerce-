import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './orderHistory.css'

const statusSteps = ['Processing', 'Shipped', 'Delivered']

export default function OrderHistory() {
  const allOrders = useSelector((state) => state.cart.orders)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const orders = userData?.role === 'admin'
    ? allOrders
    : allOrders.filter((order) =>
    {
      const currentUserId = userData?.id || userData?.username
      return order.userId ? order.userId === currentUserId : order.customerName === userData?.firstName
    })

  useEffect(() =>
  {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString()
    } catch {
      return isoString
    }
  }

  const calculateItemTax = (order, item) =>
  {
    const isAllGroceries = order.items.every((i) => i.category === "groceries")
    const taxRate = isAllGroceries ? 0.05 : 0.18
    const itemSubtotal = item.price * item.quantity
    return Number((itemSubtotal * taxRate).toFixed(2))
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <h2>📦 Order History & Tracking</h2>
        <p>Track your completed purchases and review order details.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You don't have any completed orders yet.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const activeStep = statusSteps.indexOf(order.status)
            return (
              <div key={order.id} className="order-card">
                <div className="order-summary">
                  <div>
                    <h3>Order #{order.orderNumber} - {order.customerName}</h3>
                    <p className="order-date">{formatDate(order.placedAt)}</p>
                  </div>
                  <div className="order-status-block">
                    <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                    <span className="tracking-number">Tracking: {order.trackingNumber}</span>
                  </div>
                </div>

                <div className="order-details-grid">
                  <div>
                    <p className="detail-label">Subtotal</p>
                    <p>₹{order.subtotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="detail-label">Tax</p>
                    <p>₹{order.tax.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="detail-label">Total</p>
                    <p className="detail-total">₹{order.grandTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-items-section">
                  <h4>Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity × Price</th>
                        <th>Subtotal</th>
                        <th>Tax</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) =>
                      {
                        const itemSubtotal = item.price * item.quantity
                        const itemTax = calculateItemTax(order, item)
                        const itemTotal = itemSubtotal + itemTax
                        return (
                          <tr key={item.id} className="order-item-row">
                            <td>{item.title}</td>

                            <td>{item.quantity} × ₹{item.price.toFixed(2)}</td>
                            <td>₹{itemSubtotal.toFixed(2)}</td>
                            <td>₹{itemTax.toFixed(2)}</td>
                            <td>₹{itemTotal.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="tracking-timeline">
                  {statusSteps.map((step, index) => (
                    <div key={step} className={`timeline-step ${index <= activeStep ? 'active' : ''}`}>
                      <div className="timeline-point" />
                      <div className="timeline-text">
                        <span>{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
