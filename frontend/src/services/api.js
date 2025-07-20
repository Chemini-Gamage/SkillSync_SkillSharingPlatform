import axios from "axios"

const API_BASE_URL = "http://localhost:8089"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("API request error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API response error:", error)
    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
    }
    return Promise.reject(error)
  },
)

export default api
