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
                <div className="order-header-section">
                  <div className="order-info">
                    <h3>📦 Order #{order.orderNumber}</h3>
                    <p className="order-meta">
                      <span>Placed on {formatDate(order.placedAt)}</span>
                      <span>•</span>
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    </p>
                  </div>
                  <div className="order-status-section">
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status === 'Processing' ? '🕒' :
                        order.status === 'Shipped' ? '🚚' :
                          '✅'} {order.status}
                    </span>
                    {order.trackingNumber && (
                      <p className="tracking-info">
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </p>
                    )}
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
                          <tr key={item.id}>
                            <td className="product-name">{item.title}</td>
                            <td className="quantity-price">{item.quantity} × ₹{item.price.toFixed(2)}</td>
                            <td className="price-values">₹{itemSubtotal.toFixed(2)}</td>
                            <td className="price-values">₹{itemTax.toFixed(2)}</td>
                            <td className="price-values total">₹{itemTotal.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                      <tr className="summary-footer-row">
                        <td colSpan="5">
                          <div className="summary-footer">
                            <div className="summary-line">
                              <span className="summary-label">Subtotal</span>
                              <span className="summary-value">₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                              <span className="summary-label">Tax</span>
                              <span className="summary-value">₹{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-line total">
                              <span className="summary-label">Total</span>
                              <span className="summary-value">₹{order.grandTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="tracking-timeline">
                  {statusSteps.map((step, index) =>
                  {
                    const isActive = index <= activeStep;
                    const stepClass = isActive ? `active ${order.status.toLowerCase()}` : '';
                    const icons = {
                      'Processing': '⏳',
                      'Shipped': '🚚',
                      'Delivered': '✅'
                    };
                    return (
                      <div key={step} className={`timeline-step ${stepClass}`}>
                        <div className="timeline-point">
                          {isActive ? icons[step] : '○'}
                        </div>
                        <div className="timeline-text">
                          <span>{step}</span>
                          {isActive && index === activeStep && (
                            <small style={{ display: 'block', fontSize: '0.75rem', opacity: 0.8 }}>
                              {step === 'Processing' ? 'Preparing order' :
                                step === 'Shipped' ? 'On the way' :
                                  'Completed'}
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
