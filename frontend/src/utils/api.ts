import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')
    const hasToken = useAuthStore.getState().token

    if (error.response?.status === 401) {
      // If it's a login/register endpoint, just show the error message
      if (isAuthEndpoint) {
        const message = error.response?.data?.message || 'Invalid credentials'
        toast.error(message)
      } else if (hasToken) {
        // Only logout if user was previously authenticated (session expired)
        useAuthStore.getState().logout()
        toast.error('Session expired. Please login again.')
        window.location.href = '/login'
      } else {
        // No token and not auth endpoint - show error message
        const message = error.response?.data?.message || 'Unauthorized'
        toast.error(message)
      }
    } else if (error.response?.status === 404 && error.response?.data?.message?.includes('User not found')) {
      // User not found - token is valid but user doesn't exist in database
      useAuthStore.getState().logout()
      toast.error('User account not found. Please login again.')
      window.location.href = '/login'
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error('An error occurred. Please try again.')
    }
    return Promise.reject(error)
  }
)

export default api

