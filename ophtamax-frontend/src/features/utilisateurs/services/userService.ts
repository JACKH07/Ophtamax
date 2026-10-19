import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { AppUser } from '@/api/types/entities'

export async function fetchUsers(): Promise<AppUser[]> {
  if (USE_MOCK) return mockStore.users.list()
  const { data } = await apiClient.get<ApiResponse<AppUser[]>>(ENDPOINTS.users.list)
  return data.data
}

export async function fetchUser(id: string): Promise<AppUser> {
  if (USE_MOCK) {
    const u = mockStore.users.get(id)
    if (!u) throw new Error('Utilisateur introuvable')
    return u
  }
  const { data } = await apiClient.get<ApiResponse<AppUser>>(ENDPOINTS.users.detail(id))
  return data.data
}

export async function deleteUser(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.users.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.users.detail(id))
}
