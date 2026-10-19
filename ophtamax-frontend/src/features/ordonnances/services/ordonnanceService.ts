import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Ordonnance, OrdonnanceFormData } from '@/api/types/entities'

export async function fetchOrdonnances(): Promise<Ordonnance[]> {
  if (USE_MOCK) return mockStore.ordonnances.list()
  const { data } = await apiClient.get<ApiResponse<Ordonnance[]>>(ENDPOINTS.ordonnances.list)
  return data.data
}

export async function fetchOrdonnance(id: string): Promise<Ordonnance> {
  if (USE_MOCK) {
    const item = mockStore.ordonnances.get(id)
    if (!item) throw new Error('Ordonnance introuvable')
    return item
  }
  throw new Error('Ordonnance introuvable')
}

export async function createOrdonnance(data: OrdonnanceFormData): Promise<Ordonnance> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.ordonnances.create({
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  throw new Error('Ordonnances : création non disponible')
}

export async function updateOrdonnance(id: string, data: OrdonnanceFormData): Promise<Ordonnance> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(data.patient_id)
    return mockStore.ordonnances.update(id, {
      ...data,
      patient_name: patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu',
    })
  }
  throw new Error('Ordonnances : mise à jour non disponible')
}

export async function deleteOrdonnance(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.ordonnances.remove(id)
    return
  }
  throw new Error('Ordonnances : suppression non disponible')
}
