import api from "./api"

// Login functionality
export const login = async (email, password) => {
  try {
    const response = await api.post("/api/v1/authentication/login", { email, password })
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Register functionality
export const register = async (email, password) => {
  try {
    const response = await api.post("/api/v1/authentication/register", { email, password })
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/v1/authentication/users/me")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Send email verification token
export const sendEmailVerificationToken = async () => {
  try {
    const response = await api.get("/api/v1/authentication/send-email-verification-token")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Validate email verification token
export const validateEmailVerificationToken = async (token) => {
  try {
    const response = await api.put(`/api/v1/authentication/validate-email-verification-token?token=${token}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Send password reset token
export const sendPasswordResetToken = async (email) => {
  try {
    const response = await api.put(`/api/v1/authentication/send-password-reset-token?email=${email}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Reset password with token
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await api.put(
      `/api/v1/authentication/reset-password?email=${email}&token=${token}&newPassword=${newPassword}`,
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Convert profileData object to URL params
    const params = new URLSearchParams()
    Object.entries(profileData).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })

    const response = await api.put(`/api/v1/authentication/profile/${userId}?${params.toString()}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/v1/authentication/users/${userId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Get all users except authenticated user
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/v1/authentication/users")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Logout
export const logout = () => {
  localStorage.removeItem("token")
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}
