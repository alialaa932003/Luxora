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

// On 401, clear token and redirect to login — no retry loop
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
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
    }
    return Promise.reject(error)
  },
)
