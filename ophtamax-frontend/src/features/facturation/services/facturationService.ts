import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { Facture } from '@/api/types/entities'

export async function fetchFactures(): Promise<Facture[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.factures.list()
}

export async function fetchFacture(id: string): Promise<Facture> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const f = mockStore.factures.get(id)
  if (!f) throw new Error('Facture introuvable')
  return f
}

export async function fetchCaisseJour() {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.factures.caisseJour()
}
