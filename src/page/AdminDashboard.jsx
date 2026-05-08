import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../features/productsSlice'
import './adminDashboard.css'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { products, loading, error, isFetched } = useSelector((state) => state.products)
  const orders = useSelector((state) => state.cart.orders)
  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchProducts())
    }
  }, [dispatch, isFetched])

  const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const lowStockCount = products.filter((product) => product.stock < 10).length
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">Admin Overview</p>
          <h2>Welcome back, {userData?.firstName || 'Admin'}</h2>
          <p className="dashboard-description">
            This dashboard shows the current store summary and the latest orders.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p>Total products</p>
          <h3>{totalProducts}</h3>
        </div>

        <div className="dashboard-card">
          <p>New orders</p>
          <h3>{totalOrders}</h3>
        </div>

        <div className="dashboard-card">
          <p>Revenue</p>
          <h3>₹{totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="dashboard-card">
          <p>Low stock</p>
          <h3>{lowStockCount}</h3>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent orders</h3>
          <p>{recentOrders.length} latest completed orders</p>
        </div>

        {loading ? (
          <div className="loading-status">Loading data...</div>
        ) : error ? (
          <div className="error-status">{error}</div>
        ) : recentOrders.length === 0 ? (
          <div className="empty-status">No orders have been placed yet.</div>
        ) : (
          <div className="orders-table">
            <div className="orders-row orders-row--head">
              <span>Order #</span>
              <span>Status</span>
              <span>Total</span>
              <span>Date</span>
            </div>
            {recentOrders.map((order) => (
              <div key={order.id} className="orders-row">
                <span>{order.orderNumber}</span>
                <span>{order.status}</span>
                <span>₹{order.grandTotal.toFixed(2)}</span>
                <span>{new Date(order.placedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
