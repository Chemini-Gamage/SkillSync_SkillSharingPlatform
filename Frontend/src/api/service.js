import api from "./api"

export const registerUser = async (email, password) => {
  try {
    const response = await api.post("/api/v1/authentication/register", { email, password })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}
