"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { updateUserProfile } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import "../styles/Profile.css"

const ProfileEditPage = () => {
  const { currentUser, setCurrentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    location: "",
    profilePicture: "",
    coverPicture: "",
    about: "",
  })

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        company: currentUser.company || "",
        position: currentUser.position || "",
        location: currentUser.location || "",
        profilePicture: currentUser.profilePicture || "",
        coverPicture: currentUser.coverPicture || "",
        about: currentUser.about || "",
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const updatedUser = await updateUserProfile(currentUser.id, formData)
      setCurrentUser(updatedUser)
      navigate("/profile")
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="profile-edit-container">
        <div className="profile-edit-card">
          <h2>Edit Your Profile</h2>
          <form onSubmit={handleSubmit} className="profile-edit-form">
            {error && <div className="profile-edit-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company*</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position*</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture URL</label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
              />
              {formData.profilePicture && (
                <div className="preview-image">
                  <img src={formData.profilePicture || "/placeholder.svg"} alt="Profile Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="coverPicture">Cover Picture URL</label>
              <input
                type="url"
                id="coverPicture"
                name="coverPicture"
                value={formData.coverPicture}
                onChange={handleChange}
              />
              {formData.coverPicture && (
                <div className="preview-image">
                  <img src={formData.coverPicture || "/placeholder.svg"} alt="Cover Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="about">About</label>
              <textarea id="about" name="about" value={formData.about} onChange={handleChange} rows="4"></textarea>
            </div>

            <div className="profile-edit-buttons">
              <button type="button" onClick={() => navigate("/profile")} className="cancel-button">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="save-button">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ProfileEditPage
