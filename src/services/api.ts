import axios from 'axios'
import { useLocalStorage } from '@/composables/useLocalStorage'

const storage = useLocalStorage()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://colivon-backend.test/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = storage.getItem<string>('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeItem('auth_token')
      storage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
