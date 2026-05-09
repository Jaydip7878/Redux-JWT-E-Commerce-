import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from '../features/authSlice'
import { logout } from '../features/authSlice'

import './home.css'
import { useNavigate } from 'react-router-dom'






const hasValue = (value) => value !== undefined && value !== null && value !== ''




const renderField = (label, value) =>
{
  if (!hasValue(value)) return null

  return (
    <div key={label} className="profile-item">
      <label>{label}</label>
      <p>{value}</p>
    </div>
  )
}

export default function Home()
{
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const { userData, loading, error } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (token && !userData) {
      dispatch(fetchUserData(token))
    }
  }, [token, dispatch, userData])

  const handleLogout = () =>
  {
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">Loading user profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }
  console.log(userData, "here is userData")

  const displayName = [userData?.firstName, userData?.lastName]
    .filter(hasValue)
    .join(' ') || userData?.username || 'Your Profile'

  const usernameText = hasValue(userData?.username) ? `@${userData.username}` : null
  const roleText = hasValue(userData?.role) ? userData.role : null

  const profileFields = [
    { label: 'Email', value: userData?.email },
    { label: 'Gender', value: userData?.gender },
  ]

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Your Profile</h1>
        <p className="subtitle">View and manage your personal information in one place.</p>
      </div>

      {userData ? (
        <div className="user-profile">
          <div className="profile-card">
            <div className="profile-header">
              <img
                src={userData.image}
                alt="Profile"
                className="profile-image"
              />

              <div className="profile-title">
                <h2>{displayName}</h2>
                {usernameText && <p className="username">{usernameText}</p>}
                {roleText && <p className="profile-role">{roleText}</p>}
              </div>
            </div>

            <div className="profile-grid">
              {profileFields.map((field) => renderField(field.label, field.value))}
            </div>
            <div className="profile-grid">
              <div className='profile-item'>
                <p><b>Token:</b>{token}</p>
              </div>

            </div>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>No user data available</p>
        </div>
      )}
    </div>
  )
}
