"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register, getCurrentUser } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import "../styles/Auth.css"

const SignupForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setCurrentUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await register(email, password)
      localStorage.setItem("token", response.token)

      // Get user data after successful registration
      const userData = await getCurrentUser()
      setCurrentUser(userData)

      // Redirect to email verification
      navigate("/verify-email")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <p className="password-hint">
        By clicking Agree & Join, you agree to the SkillSync User Agreement, Privacy Policy, and Cookie Policy.
      </p>
      <button type="submit" disabled={loading} className="auth-button">
        {loading ? "Creating Account..." : "Agree & Join"}
      </button>
    </form>
  )
}

export default SignupForm
