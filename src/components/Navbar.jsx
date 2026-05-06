import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/authSlice'
import { toggleDarkMode } from '../features/themeSlice'
import './navbar.css'

export default function Navbar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const token = useSelector((state)=>state.auth.token)
  const cartItems = useSelector((state)=>state.cart.items)
  const userData = useSelector((state)=>state.auth.userData)
  const isDarkMode = useSelector((state)=>state.theme.isDarkMode)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const handleLogout = () =>{
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleToggleDarkMode = () =>{
    dispatch(toggleDarkMode())
  }
  
   return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>📱 Shop</h2>
        </div>
        
        <div className="navbar-menu">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
           <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/cart" className="nav-link">
            🛒 Cart <span className="cart-badge">{cartItems.length}</span>
          </Link>
        </div>

        <div className="navbar-user">
          {userData && <span className="user-name">👤 {userData.firstName}</span>}
          <button onClick={handleToggleDarkMode} className="btn-theme" title="Toggle dark mode">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
   )
  }
