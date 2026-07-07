import axios from 'axios'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach access token to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Flag to prevent multiple concurrent refresh requests
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return http(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
        const newToken = data.data.accessToken
        localStorage.setItem('access_token', newToken)
        
        const { useAuthStore } = await import('@/stores/auth.store')
        const authStore = useAuthStore()
        authStore.token = newToken
        
        processQueue(null, newToken)
        
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        return http(originalRequest)
      } catch (err) {
        processQueue(err, null)
        
        try {
          const { useAuthStore } = await import('@/stores/auth.store')
          const authStore = useAuthStore()
          authStore.clearAuth()
        } catch (e) {
          localStorage.removeItem('access_token')
        }
        
        const currentPath = router.currentRoute.value.fullPath
        if (!currentPath.startsWith('/auth/login')) {
          router.push({ name: 'login', query: { redirect: currentPath } })
        }
        
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  },
)
