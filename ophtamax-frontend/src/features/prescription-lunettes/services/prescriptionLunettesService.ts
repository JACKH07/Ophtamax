import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { PrescriptionLunettes, PrescriptionLunettesFormData } from '@/api/types/entities'

export async function fetchPrescriptionsLunettes(): Promise<PrescriptionLunettes[]> {
  if (USE_MOCK) return mockStore.prescriptionsLunettes.list()
  const { data } = await apiClient.get<ApiResponse<PrescriptionLunettes[]>>(
    ENDPOINTS.prescriptionsLunettes.list,
  )
  return data.data
}

export async function fetchPrescriptionLunettes(id: string): Promise<PrescriptionLunettes> {
  if (USE_MOCK) {
    const item = mockStore.prescriptionsLunettes.get(id)
    if (!item) throw new Error('Prescription lunettes introuvable')
    return item
  }
  throw new Error('Prescription lunettes introuvable')
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
  throw new Error('Prescriptions lunettes : création non disponible')
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
  throw new Error('Prescriptions lunettes : mise à jour non disponible')
}

export async function deletePrescriptionLunettes(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.prescriptionsLunettes.remove(id)
    return
  }
  throw new Error('Prescriptions lunettes : suppression non disponible')
}
