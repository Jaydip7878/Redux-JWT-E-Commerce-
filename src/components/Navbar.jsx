import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toggleDarkMode } from '../features/themeSlice'
import './navbar.css'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dispatch = useDispatch()

  const token = useSelector((state)=>state.auth.token)
  const cartItems = useSelector((state)=>state.cart.items)
  const userData = useSelector((state)=>state.auth.userData)
  const isDarkMode = useSelector((state)=>state.theme.isDarkMode)
  const isAdmin = userData?.role === 'admin' || userData?.username === 'Jaydip'

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

 

  const handleToggleDarkMode = () =>{
    dispatch(toggleDarkMode())
  }

  const closeMobileMenu = () =>
  {
    setMobileMenuOpen(false)
  }

  useEffect(() =>
  {
    const handleResize = () =>
    {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-mark">📱</span>
          <div>
            <h1>ShopEase</h1>
            <p>Your classic shopping hub</p>
          </div>
        </Link>

        <button
          className={`navbar-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Toggle menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/home" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/products" className="nav-link" onClick={closeMobileMenu}>Products</Link>
          <Link to="/orders" className="nav-link" onClick={closeMobileMenu}>Orders</Link>
          {isAdmin && <Link to="/admin" className="nav-link" onClick={closeMobileMenu}>Admin Dashboard</Link>}
          <Link to="/cart" className="nav-link" onClick={closeMobileMenu}>
            🛒 Cart <span className="cart-badge">{cartItems.length}</span>
          </Link>
        </div>

        <div className="navbar-user">
          {userData && <span className="user-name">{userData.firstName}</span>}
          <button onClick={handleToggleDarkMode} className="btn-theme" title="Toggle dark mode">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        
        </div>
      </div>
    </nav>
  )
}
