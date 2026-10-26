import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { PrescriptionLunettes, PrescriptionLunettesFormData } from '@/api/types/entities'
import { PAGE_SIZE, pageFromResponse, slicePage, type PageResult } from '@/utils/pagination'

export async function fetchPrescriptionsLunettes(
  page = 1,
  perPage = PAGE_SIZE,
): Promise<PageResult<PrescriptionLunettes>> {
  if (USE_MOCK) return slicePage(mockStore.prescriptionsLunettes.list(), page, perPage)
  const { data } = await apiClient.get<ApiResponse<PrescriptionLunettes[]>>(
    ENDPOINTS.prescriptionsLunettes.list,
    { params: { page, per_page: perPage } },
  )
  return pageFromResponse(data, page, perPage)
}

export async function fetchPrescriptionLunettes(id: string): Promise<PrescriptionLunettes> {
  if (USE_MOCK) {
    const item = mockStore.prescriptionsLunettes.get(id)
    if (!item) throw new Error('Prescription lunettes introuvable')
    return item
  }
  const { data } = await apiClient.get<ApiResponse<PrescriptionLunettes>>(
    ENDPOINTS.prescriptionsLunettes.detail(id),
  )
  return data.data
}

export async function createPrescriptionLunettes(
  data: PrescriptionLunettesFormData,
): Promise<PrescriptionLunettes> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.prescriptionsLunettes.create({
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: created } = await apiClient.post<ApiResponse<PrescriptionLunettes>>(
    ENDPOINTS.prescriptionsLunettes.list,
    data,
  )
  return created.data
}

export async function updatePrescriptionLunettes(
  id: string,
  data: PrescriptionLunettesFormData,
): Promise<PrescriptionLunettes> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.prescriptionsLunettes.update(id, {
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: updated } = await apiClient.put<ApiResponse<PrescriptionLunettes>>(
    ENDPOINTS.prescriptionsLunettes.detail(id),
    data,
  )
  return updated.data
}

export async function deletePrescriptionLunettes(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.prescriptionsLunettes.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.prescriptionsLunettes.detail(id))
}
