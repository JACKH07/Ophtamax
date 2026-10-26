import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { PrescriptionExamen, PrescriptionExamenFormData } from '@/api/types/entities'
import { PAGE_SIZE, pageFromResponse, slicePage, type PageResult } from '@/utils/pagination'

export async function fetchPrescriptionsExamen(
  page = 1,
  perPage = PAGE_SIZE,
): Promise<PageResult<PrescriptionExamen>> {
  if (USE_MOCK) return slicePage(mockStore.prescriptionsExamen.list(), page, perPage)
  const { data } = await apiClient.get<ApiResponse<PrescriptionExamen[]>>(
    ENDPOINTS.prescriptionsExamen.list,
    { params: { page, per_page: perPage } },
  )
  return pageFromResponse(data, page, perPage)
}

export async function fetchPrescriptionExamen(id: string): Promise<PrescriptionExamen> {
  if (USE_MOCK) {
    const item = mockStore.prescriptionsExamen.get(id)
    if (!item) throw new Error('Prescription examen introuvable')
    return item
  }
  const { data } = await apiClient.get<ApiResponse<PrescriptionExamen>>(ENDPOINTS.prescriptionsExamen.detail(id))
  return data.data
}

export async function createPrescriptionExamen(
  data: PrescriptionExamenFormData,
): Promise<PrescriptionExamen> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.prescriptionsExamen.create({
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: created } = await apiClient.post<ApiResponse<PrescriptionExamen>>(
    ENDPOINTS.prescriptionsExamen.list,
    data,
  )
  return created.data
}

export async function updatePrescriptionExamen(
  id: string,
  data: PrescriptionExamenFormData,
): Promise<PrescriptionExamen> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.prescriptionsExamen.update(id, {
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  const { data: updated } = await apiClient.put<ApiResponse<PrescriptionExamen>>(
    ENDPOINTS.prescriptionsExamen.detail(id),
    data,
  )
  return updated.data
}

export async function deletePrescriptionExamen(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.prescriptionsExamen.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.prescriptionsExamen.detail(id))
}
