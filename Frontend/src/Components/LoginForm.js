"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login, getCurrentUser } from "../services/auth"
import { useAuth } from "../context/AuthContext"
import "../styles/Auth.css"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setCurrentUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await login(email, password)
      localStorage.setItem("token", response.token)

      // Get user data after successful login
      const userData = await getCurrentUser()
      setCurrentUser(userData)

      // Redirect to appropriate page
      if (!userData.emailVerified) {
        navigate("/verify-email")
      } else if (!userData.profileComplete) {
        navigate("/profile/edit")
      } else {
        navigate("/profile")
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
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
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} className="auth-button">
        {loading ? "Signing In..." : "Sign In"}
      </button>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </form>
  )
}

export default LoginForm
