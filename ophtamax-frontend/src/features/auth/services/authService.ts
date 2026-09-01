import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockLogin, mockMe } from '@/api/mock/authMock'
import type { ApiResponse, AuthResponse } from '@/api/types/auth'

export interface LoginCredentials {
  login: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    const result = mockLogin(credentials.login, credentials.password)
    if (!result) {
      throw new Error('Identifiant ou mot de passe incorrect')
    }
    return result
  }

  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.login, credentials)
  return data.data
}

export async function logout(): Promise<void> {
  if (USE_MOCK) return
  await apiClient.post(ENDPOINTS.auth.logout)
}

export async function fetchMe(): Promise<AuthResponse> {
  if (USE_MOCK) {
    const token = sessionStorage.getItem('ophtamax_token')
    if (!token) throw new Error('Non authentifié')
    const result = mockMe(token)
    if (!result) throw new Error('Session invalide')
    return result
  }

  const { data } = await apiClient.get<ApiResponse<AuthResponse>>(ENDPOINTS.auth.me)
  return data.data
}
