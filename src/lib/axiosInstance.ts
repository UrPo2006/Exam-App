// lib/axiosInstance.ts
import { getDecodedToken } from '@/app/api/helpers/auth'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
})


// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const decoded = await getDecodedToken()
    if (decoded) {
      config.headers.Authorization = `Bearer ${decoded}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const decoded = await getDecodedToken()
    if (decoded?.token) {
      config.headers.Authorization = `Bearer ${decoded.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
export default axiosInstance