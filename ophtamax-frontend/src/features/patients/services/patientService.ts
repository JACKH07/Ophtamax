import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Patient, PatientFormData } from '@/api/types/entities'

export async function fetchPatients(search?: string): Promise<Patient[]> {
  if (USE_MOCK) {
    let list = mockStore.patients.list()
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.prenom.toLowerCase().includes(q) ||
          p.contact.includes(q),
      )
    }
    return list
  }

  const { data } = await apiClient.get<ApiResponse<Patient[]>>(ENDPOINTS.patients.list, {
    params: { search, per_page: 100 },
  })
  return data.data
}

export async function fetchPatient(id: string): Promise<Patient> {
  if (USE_MOCK) {
    const p = mockStore.patients.get(id)
    if (!p) throw new Error('Patient introuvable')
    return p
  }
  const { data } = await apiClient.get<ApiResponse<Patient>>(ENDPOINTS.patients.detail(id))
  return data.data
}

export async function createPatient(payload: PatientFormData): Promise<Patient> {
  if (USE_MOCK) {
    return mockStore.patients.create({ ...payload, derniere_visite: undefined })
  }
  const { data } = await apiClient.post<ApiResponse<Patient>>(ENDPOINTS.patients.list, payload)
  return data.data
}

export async function updatePatient(id: string, payload: PatientFormData): Promise<Patient> {
  if (USE_MOCK) return mockStore.patients.update(id, payload)
  const { data } = await apiClient.put<ApiResponse<Patient>>(ENDPOINTS.patients.detail(id), payload)
  return data.data
}

export async function deletePatient(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.patients.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.patients.detail(id))
}
