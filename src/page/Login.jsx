import React, { useEffect, useState } from 'react'
import { loginUser } from '../features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import './auth.css'

export default function Login() {
  const [userName,setUserName] = useState('')
  const [password,setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {token,loading,error} = useSelector((state)=>state.auth)

  useEffect(()=>{
    if(token){
      navigate('/home')
    }
  },[token, navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(loginUser({ username:userName, password }))
  }

  if(loading){
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="loading-message">Loadin...</div>
          <div className="loading-message">Loadin...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to your account</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text"
                id="username"
                placeholder='Enter your username'
                value={userName}
                onChange={(e)=> setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                placeholder='Enter your password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type='submit' 
              disabled={!userName || !password}
              className="btn-submit"
            >
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="link">Register here</Link></p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <p>Username: <strong>emilys</strong></p>
            <p>Password: <strong>emilyspass</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
