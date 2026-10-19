import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Facture, FactureFormData } from '@/api/types/entities'

export async function fetchFactures(): Promise<Facture[]> {
  if (USE_MOCK) return mockStore.factures.list()
  const { data } = await apiClient.get<ApiResponse<Facture[]>>(ENDPOINTS.facturation.factures)
  return data.data
}

export async function fetchFacture(id: string): Promise<Facture> {
  if (USE_MOCK) {
    const f = mockStore.factures.get(id)
    if (!f) throw new Error('Facture introuvable')
    return f
  }
  const { data } = await apiClient.get<ApiResponse<Facture>>(ENDPOINTS.facturation.factureDetail(id))
  return data.data
}

export async function createFacture(payload: FactureFormData): Promise<Facture> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(payload.patient_id)
    const patient_name = patient
      ? `${patient.nom} ${patient.prenom}`.trim() || `Patient ${payload.patient_id}`
      : 'Patient inconnu'
    return mockStore.factures.create({ ...payload, patient_name })
  }
  throw new Error('Facturation : création non disponible (pas de table facture en BDD v1)')
}

export async function fetchCaisseJour() {
  if (USE_MOCK) return mockStore.factures.caisseJour()
  const { data } = await apiClient.get<ApiResponse<{
    date: string
    total: number
    count: number
    factures: Facture[]
  }>>(ENDPOINTS.facturation.caisseJour)
  return data.data
}
