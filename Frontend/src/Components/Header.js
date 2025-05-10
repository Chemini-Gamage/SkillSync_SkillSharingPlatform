/*"use client"

import { Link, useNavigate } from "react-router-dom"
import { logout } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import "../styles/Header.css"

const Header = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="header">
      <div className="header-content">
      <Link to="/profile" className="logo">
        <img src="/logo1.png" alt="SkillSync Logo" className="logo-img" />
    </Link>

        <nav className="nav">
          <Link to="/feed" className="nav-link">
            Feed
          </Link>
          <Link to="/network" className="nav-link">
            My Network
          </Link>
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
          <Link to="/messaging" className="nav-link">
            Messaging
          </Link>
          <Link to="/notifications" className="nav-link">
            Notifications
          </Link>
        </nav>
        <div className="user-menu">
          <div className="profile-dropdown">
            <div className="profile-trigger">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture || "/placeholder.svg"}
                  alt={currentUser.firstName || currentUser.email}
                  className="profile-avatar"
                />
              ) : (
                <div className="default-avatar">
                  {currentUser?.firstName ? currentUser.firstName.charAt(0) : currentUser?.email.charAt(0)}
                </div>
              )}
              
            </div>
            <div className="profile-dropdown-content">
              <div className="profile-dropdown-header">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture || "/placeholder.svg"}
                    alt={currentUser.firstName || currentUser.email}
                    className="profile-dropdown-avatar"
                  />
                ) : (
                  <div className="default-avatar-large">
                    {currentUser?.firstName ? currentUser.firstName.charAt(0) : currentUser?.email.charAt(0)}
                  </div>
                )}
                <div className="profile-dropdown-info">
                  <h3>
                    {currentUser?.firstName && currentUser?.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : "Complete your profile"}
                  </h3>
                  <p>{currentUser?.position || "Add position"}</p>
                </div>
              </div>
              <div className="profile-dropdown-divider"></div>
              <Link to="/profile" className="profile-dropdown-item">
                View Profile
              </Link>
              <Link to="/profile/edit" className="profile-dropdown-item">
                Edit Profile
              </Link>
              <div className="profile-dropdown-divider"></div>
              <button onClick={handleLogout} className="profile-dropdown-item logout-item">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header*/

"use client"

import { Link, useNavigate } from "react-router-dom"
import { logout } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import "../styles/Header.css"

const Header = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/profile" className="logo">
          SkillSync
        </Link>
        <nav className="nav">
          <Link to="/feed" className="nav-link">
            Feed
          </Link>
          <Link to="/network" className="nav-link">
            My Network
          </Link>
          <Link to="/messaging" className="nav-link">
            Messaging
          </Link>
          <Link to="/notifications" className="nav-link">
            Notifications
          </Link>
        </nav>
        <div className="user-menu">
          <div className="profile-dropdown">
            <div className="profile-trigger">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture || "/placeholder.svg"}
                  alt={currentUser.firstName || currentUser.email}
                  className="profile-avatar"
                />
              ) : (
                <div className="default-avatar">
                  {currentUser?.firstName ? currentUser.firstName.charAt(0) : currentUser?.email.charAt(0)}
                </div>
              )}
              <span>Me</span>
            </div>
            <div className="profile-dropdown-content">
              <div className="profile-dropdown-header">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture || "/placeholder.svg"}
                    alt={currentUser.firstName || currentUser.email}
                    className="profile-dropdown-avatar"
                  />
                ) : (
                  <div className="default-avatar-large">
                    {currentUser?.firstName ? currentUser.firstName.charAt(0) : currentUser?.email.charAt(0)}
                  </div>
                )}
                <div className="profile-dropdown-info">
                  <h3>
                    {currentUser?.firstName && currentUser?.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : "Complete your profile"}
                  </h3>
                  <p>{currentUser?.position || "Add skills"}</p>
                </div>
              </div>
              <div className="profile-dropdown-divider"></div>
              <Link to="/profile" className="profile-dropdown-item">
                View Profile
              </Link>
              <Link to="/profile/edit" className="profile-dropdown-item">
                Edit Profile
              </Link>
              <div className="profile-dropdown-divider"></div>
              <button onClick={handleLogout} className="profile-dropdown-item logout-item">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
