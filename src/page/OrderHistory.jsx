import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './orderHistory.css'

const statusSteps = ['Processing', 'Shipped', 'Delivered']

export default function OrderHistory() {
  const orders = useSelector((state) => state.cart.orders)
  const navigate = useNavigate()

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString()
    } catch {
      return isoString
    }
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <h2>📦 Order History & Tracking</h2>
        <p>Track your completed purchases and review order details.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You don’t have any completed orders yet.</p>
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
                    <h3>{order.orderNumber}</h3>
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
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id} className="order-item-row">
                        <span>{item.title}</span>
                        <span>{item.quantity} × ₹{item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
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
