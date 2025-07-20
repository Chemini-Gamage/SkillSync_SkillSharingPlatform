"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { resetPassword } from "../services/auth"
import "../styles/Auth.css"

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get token and email from URL query params
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")
  const email = queryParams.get("email")

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [token, email])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await resetPassword(email, token, newPassword)
      setMessage(response.message)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SkillSync</h1>
      </div>
      <div className="auth-card">
        <h2>Reset Password</h2>
        {message ? (
          <div className="auth-success">
            <p>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading || !token || !email} className="auth-button">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
      <div className="auth-footer">
        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
