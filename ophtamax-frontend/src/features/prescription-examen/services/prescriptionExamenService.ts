import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { PrescriptionExamen, PrescriptionExamenFormData } from '@/api/types/entities'

export async function fetchPrescriptionsExamen(): Promise<PrescriptionExamen[]> {
  if (USE_MOCK) return mockStore.prescriptionsExamen.list()
  const { data } = await apiClient.get<ApiResponse<PrescriptionExamen[]>>(
    ENDPOINTS.prescriptionsExamen.list,
  )
  return data.data
}

export async function fetchPrescriptionExamen(id: string): Promise<PrescriptionExamen> {
  if (USE_MOCK) {
    const item = mockStore.prescriptionsExamen.get(id)
    if (!item) throw new Error('Prescription examen introuvable')
    return item
  }
  throw new Error('Prescription examen introuvable')
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
  throw new Error('Prescriptions examen : création non disponible')
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
  throw new Error('Prescriptions examen : mise à jour non disponible')
}

export async function deletePrescriptionExamen(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.prescriptionsExamen.remove(id)
    return
  }
  throw new Error('Prescriptions examen : suppression non disponible')
}
