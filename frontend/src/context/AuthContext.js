"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, isAuthenticated } from "../services/auth"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser()
          setCurrentUser(userData)
        } catch (err) {
          setError(err.message)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // Update the context value
  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
