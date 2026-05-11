import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromWishlist } from '../features/wishlistSlice'
import { addToCart } from '../features/cartSlice'
import { decreaseStock } from '../features/productsSlice'
import './products.css'
import './products-cards.css'

export default function Wishlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.wishlist)
  const cartItems = useSelector((state) => state.cart.items)
  const [searchText, setSearchText] = useState('')

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    dispatch(decreaseStock({ productId: product.id, quantity: 1 }))
    dispatch(removeFromWishlist(product.id)) // Optional: remove from wishlist after adding to cart
    alert(`${product.title} added to cart!`)
  }

  const isInCart = (id) => {
    return cartItems.some(item => item.id === id)
  }

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchText.toLowerCase())) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  )

  if (items.length === 0) {
    return (
      <div className="products-page">
        <div className="products-container">
          <div className="page-header">
            <div>
              <h2>My Wishlist</h2>
              <p>Total Items: <strong>0</strong></p>
            </div>
          </div>
          <div className="no-data">Your wishlist is empty. Start adding products you love!</div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={() => navigate('/products')} className="btn-add">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2>My Wishlist</h2>
            <p>
              Total Items: <strong>{items.length}</strong>
              {searchText && ` | Showing: ${filteredItems.length}`}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredItems.length === 0 ? (
            <div className="no-data">No items found matching your search.</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="product-card">
                <div className="card-media">
                  <img
                    src={item.thumbnail || item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={item.title}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <div className="rating">⭐ {item.rating}</div>
                  <div className="quick-actions">
                    <button className="quick-action-btn" title="Remove from Wishlist" onClick={() => handleRemove(item.id)}>🗑️</button>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-category">{item.category}</p>
                  <p className="card-brand">{item.brand || '-'}</p>
                  <div className="card-row">
                    <div className="price">${item.price}</div>
                    <div className={item.stock < 10 ? 'stock-low small' : 'stock-ok small'}>
                      {item.stock < 10 ? 'Low Stock' : `${item.stock} left`}
                    </div>
                  </div>
                  <div className="card-actions">
                    {!isInCart(item.id) && (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn-add-cart"
                        disabled={item.stock <= 0}
                      >
                        🛒 Add to Cart
                      </button>
                    )}
                    {isInCart(item.id) && (
                      <button
                        onClick={() => navigate('/cart')}
                        className="btn-view-cart"
                      >
                        View in Cart
                      </button>
                    )}
                    {/* <button
                      onClick={() => handleRemove(item.id)}
                      className="btn-delete"
                    >
                      ❤️ Remove from Wishlist
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}