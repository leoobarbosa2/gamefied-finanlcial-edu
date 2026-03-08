import axios from 'axios'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from '../store/authStore'

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000, // 10s — prevents infinite loading when backend is unreachable
  // withCredentials not needed — cookies are handled manually via SecureStore
})

// Request logger
client.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

// Response logger (added below in response interceptor)

// On 401, try to refresh the token once
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

client.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    console.warn(`[API] ERR ${error.response?.status ?? 'TIMEOUT'} ${error.config?.url} —`, error.message)
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return client(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = await getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token')

        // Send refresh token in body — Set-Cookie is filtered by iOS/Android OS layers
        const { data } = await client.post<{ data: { accessToken: string; refreshToken: string } }>(
          '/auth/refresh',
          { refreshToken },
        )

        const newToken = data.data.accessToken
        await setAccessToken(newToken)
        // Rotate refresh token too
        if (data.data.refreshToken) await setRefreshToken(data.data.refreshToken)
        client.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return client(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        await clearTokens()
        // Dynamic import to avoid circular dependency
        const { router } = await import('expo-router')
        router.replace('/(auth)/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default client
