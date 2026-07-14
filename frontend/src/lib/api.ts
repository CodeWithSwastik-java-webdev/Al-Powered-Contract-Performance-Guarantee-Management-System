// =============================================================================
// Axios API Client
// Attaches Firebase ID token to every request automatically.
// Uses the Vite proxy (/api → localhost:3000) so no CORS issues in dev.
// =============================================================================

import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ── Request Interceptor: attach Firebase ID token ──────────────────────────
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor: normalize errors ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // If 401, the token is expired or invalid — let AuthContext handle it
      if (status === 401) {
        console.warn('[API] Unauthorized — token may be expired')
      }

      // Return a cleaner error object
      const message =
        data?.error?.message ?? data?.message ?? 'An unexpected error occurred'
      return Promise.reject(new Error(message))
    }

    // Network error
    if (error.request) {
      return Promise.reject(new Error('Network error — please check your connection'))
    }

    return Promise.reject(error)
  },
)

export default api
