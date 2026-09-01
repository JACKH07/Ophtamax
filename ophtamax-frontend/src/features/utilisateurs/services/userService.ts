import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { AppUser } from '@/api/types/entities'

export async function fetchUsers(): Promise<AppUser[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.users.list()
}

export async function fetchUser(id: string): Promise<AppUser> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const u = mockStore.users.get(id)
  if (!u) throw new Error('Utilisateur introuvable')
  return u
}
