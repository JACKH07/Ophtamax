import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { RendezVous } from '@/api/types/entities'

export async function fetchRendezVous(): Promise<RendezVous[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.rendezVous.list()
}

export async function updateRdvStatut(id: string, statut: RendezVous['statut']): Promise<RendezVous> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.rendezVous.updateStatut(id, statut)
}
