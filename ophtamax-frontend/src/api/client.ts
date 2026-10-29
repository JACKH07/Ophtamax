import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, USE_MOCK } from './endpoints'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken(): string | null {
  return authToken
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !USE_MOCK) {
      authToken = null
      try {
        sessionStorage.removeItem('ophtamax-auth')
        localStorage.removeItem('ophtamax-auth')
        sessionStorage.removeItem('ophtamax_token')
      } catch {
        // ignore
      }
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
    if (data?.message) return data.message
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first?.[0]) return first[0]
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Une erreur inattendue s\'est produite'
}
