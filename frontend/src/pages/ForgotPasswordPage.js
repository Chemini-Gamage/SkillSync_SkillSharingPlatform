"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { sendPasswordResetToken } from "../services/auth"
import "../styles/Auth.css"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await sendPasswordResetToken(email)
      setMessage(response.message)
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.")
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
        <h2>Forgot Password</h2>
        {message ? (
          <div className="auth-success">
            <p>{message}</p>
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
      <div className="auth-footer">
        <p>
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
