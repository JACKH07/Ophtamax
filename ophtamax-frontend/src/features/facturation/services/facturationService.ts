import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Facture, FactureFormData } from '@/api/types/entities'
import { PAGE_SIZE, pageFromResponse, slicePage, type PageResult } from '@/utils/pagination'

export async function fetchFactures(page = 1, perPage = PAGE_SIZE): Promise<PageResult<Facture>> {
  if (USE_MOCK) {
    const pageResult = slicePage(mockStore.factures.list(), page, perPage)
    const impayes = mockStore.factures.list()
      .filter((f) => f.statut === 'impayee')
      .reduce((sum, f) => sum + f.montant_ttc, 0)
    return { ...pageResult, impayes }
  }
  const { data } = await apiClient.get<ApiResponse<Facture[]>>(ENDPOINTS.facturation.factures, {
    params: { page, per_page: perPage },
  })
  return pageFromResponse(data, page, perPage)
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
  const { data } = await apiClient.post<ApiResponse<Facture>>(ENDPOINTS.facturation.factures, payload)
  return data.data
}

export async function deleteFacture(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.factures.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.facturation.factureDetail(id))
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
