"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { validateEmailVerificationToken, sendEmailVerificationToken } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import "../styles/Auth.css"

const EmailVerificationPage = () => {
  const [token, setToken] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get token from URL if present
  const queryParams = new URLSearchParams(location.search)
  const urlToken = queryParams.get("token")

  // Use useCallback to memoize the function
  const handleVerifyEmail = useCallback(
    async (verificationToken) => {
      setLoading(true)
      setError("")
      setMessage("")

      try {
        const response = await validateEmailVerificationToken(verificationToken)
        setMessage(response.message)
        setTimeout(() => {
          navigate("/profile")
        }, 3000)
      } catch (err) {
        setError(err.message || "Failed to verify email. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (urlToken) {
      setToken(urlToken)
      handleVerifyEmail(urlToken)
    }
  }, [urlToken, handleVerifyEmail])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleVerifyEmail(token)
  }

  const handleResendToken = async () => {
    setResendLoading(true)
    setError("")

    try {
      const response = await sendEmailVerificationToken()
      setMessage(response.message)
    } catch (err) {
      setError(err.message || "Failed to resend verification token. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser && !urlToken) {
      navigate("/login")
    }
  }, [currentUser, navigate, urlToken])

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>SkillSync</h1>
      </div>
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        {message ? (
          <div className="auth-success">
            <p>{message}</p>
            <p>Redirecting to your profile...</p>
          </div>
        ) : (
          <>
            <p className="auth-description">Please enter the verification code sent to your email address.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              <div className="form-group">
                <label htmlFor="token">Verification Code</label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="Enter 5-digit code"
                />
              </div>
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Verifying..." : "Verify Email"}
              </button>
              <div className="auth-links">
                <button type="button" onClick={handleResendToken} disabled={resendLoading} className="resend-button">
                  {resendLoading ? "Sending..." : "Resend verification code"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <div className="auth-footer">
        <p>
          <Link to="/profile">Skip for now</Link>
        </p>
      </div>
    </div>
  )
}

export default EmailVerificationPage
