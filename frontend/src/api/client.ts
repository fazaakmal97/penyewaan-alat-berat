import axios from 'axios'
import { clearAuthForRequest, getTokenForRequest } from '@/utils/authToken'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const url = config.url ?? ''
  const token = getTokenForRequest(url)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthForRequest(error.config?.url)
    }
    return Promise.reject(error)
  },
)

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
