import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Ordonnance, OrdonnanceFormData } from '@/api/types/entities'
import { PAGE_SIZE, pageFromResponse, slicePage, type PageResult } from '@/utils/pagination'

export async function fetchOrdonnances(page = 1, perPage = PAGE_SIZE): Promise<PageResult<Ordonnance>> {
  if (USE_MOCK) return slicePage(mockStore.ordonnances.list(), page, perPage)
  const { data } = await apiClient.get<ApiResponse<Ordonnance[]>>(ENDPOINTS.ordonnances.list, {
    params: { page, per_page: perPage },
  })
  return pageFromResponse(data, page, perPage)
}

export async function fetchOrdonnance(id: string): Promise<Ordonnance> {
  if (USE_MOCK) {
    const item = mockStore.ordonnances.get(id)
    if (!item) throw new Error('Ordonnance introuvable')
    return item
  }
  const { data } = await apiClient.get<ApiResponse<Ordonnance>>(ENDPOINTS.ordonnances.detail(id))
  return data.data
}

export async function createOrdonnance(data: OrdonnanceFormData): Promise<Ordonnance> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.ordonnances.create({
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: created } = await apiClient.post<ApiResponse<Ordonnance>>(ENDPOINTS.ordonnances.list, data)
  return created.data
}

export async function updateOrdonnance(id: string, data: OrdonnanceFormData): Promise<Ordonnance> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.ordonnances.update(id, {
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: updated } = await apiClient.put<ApiResponse<Ordonnance>>(ENDPOINTS.ordonnances.detail(id), data)
  return updated.data
}

export async function deleteOrdonnance(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.ordonnances.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.ordonnances.detail(id))
}
