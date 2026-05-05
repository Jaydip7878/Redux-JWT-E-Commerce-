import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from '../features/authSlice'
import './home.css'

export default function Home() {

  const dispatch = useDispatch()
  const token = useSelector ((state)=>state.auth.token)
  const { userData, loading, error } = useSelector((state)=>state.auth)

  useEffect(() => {
    if (token && !userData) {
      dispatch(fetchUserData(token))
    }
  }, [token, dispatch, userData])

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

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Your Profile</h1>
        <p className="subtitle">View and manage your personal information</p>
      </div>

      {userData ? (
        <div className="user-profile">
          <div className="profile-card">
            <div className="profile-header">
              <img 
                src={userData.image || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="profile-image"
              />
              <div className="profile-title">
                <h2>{userData.firstName} {userData.lastName}</h2>
                <p className="username">@{userData.username}</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-item">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>  
              <div className="profile-item">
                <label>Phone</label>
                <p>{userData.phone }</p>
              </div>

              <div className="profile-item">
                <label>Gender</label>
                <p>{userData.gender }</p>
              </div>

              <div className="profile-item">
                <label>Age</label>
                <p>{userData.age } years</p>
              </div>

              <div className="profile-item">
                <label>Birth Date</label>
                <p>{userData.birthDate }</p>
              </div>

              <div className="profile-item">
                <label>Blood Group</label>
                <p>{userData.bloodGroup }</p>
              </div>

              <div className="profile-item full-width">
                <label>Address</label>
                <p>{userData.address?.address }</p>
              </div>  

              <div className="profile-item">
                <label>City</label>
                <p>{userData.address?.city }</p>
              </div>

              <div className="profile-item">
                <label>State</label>
                <p>{userData.address?.state}</p>
              </div>

              <div className="profile-item">
                <label>Postal Code</label>
                <p>{userData.address?.postalCode}</p>
              </div>

              <div className="profile-item">
                <label>Country</label>
                <p>{userData.address?.country }</p>
              </div>

              <div className="profile-item">
                <label>Company</label>
                <p>{userData.company?.name }</p>
              </div>

              <div className="profile-item">
                <label>Department</label>
                <p>{userData.company?.department }</p>
              </div>

              <div className="profile-item">
                <label>Job Title</label>
                <p>{userData.company?.title }</p>
              </div>
            </div>
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
