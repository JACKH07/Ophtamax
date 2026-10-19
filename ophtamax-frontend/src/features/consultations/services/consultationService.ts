import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { dossierNumero, mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { Consultation, ExamenOeil } from '@/api/types/entities'

export async function fetchConsultations(): Promise<Consultation[]> {
  if (USE_MOCK) return mockStore.consultations.list()
  const { data } = await apiClient.get<ApiResponse<Consultation[]>>(ENDPOINTS.consultations.list, {
    params: { per_page: 100 },
  })
  return data.data
}

export async function fetchConsultation(id: string): Promise<Consultation> {
  if (USE_MOCK) {
    const c = mockStore.consultations.get(id)
    if (!c) throw new Error('Consultation introuvable')
    return c
  }
  const { data } = await apiClient.get<ApiResponse<Consultation>>(ENDPOINTS.consultations.detail(id))
  return data.data
}

export async function fetchConsultationsByPatient(patientId: string): Promise<Consultation[]> {
  if (USE_MOCK) return mockStore.consultations.byPatient(patientId)
  const { data } = await apiClient.get<ApiResponse<Consultation[]>>(
    ENDPOINTS.patients.consultations(patientId),
  )
  return data.data
}

export interface ConsultationFormData {
  id_patient: string
  patient_name: string
  dossier_numero: string
  diagnostic: string
  examen_od: ExamenOeil
  examen_og: ExamenOeil
  ordonnance: string
  prescription: string
  conduite_a_tenir: string
  prochain_rdv_date: string
  prochain_rdv_delai: string
  statut: 'brouillon' | 'terminee'
}

export async function createConsultation(payload: ConsultationFormData): Promise<Consultation> {
  if (USE_MOCK) {
    return mockStore.consultations.create({
      ...payload,
      datecons: new Date().toISOString(),
    })
  }
  const { data } = await apiClient.post<ApiResponse<Consultation>>(
    ENDPOINTS.consultations.list,
    payload,
  )
  return data.data
}

export async function updateConsultation(
  id: string,
  payload: ConsultationFormData,
): Promise<Consultation> {
  if (USE_MOCK) return mockStore.consultations.update(id, payload)
  const { data } = await apiClient.put<ApiResponse<Consultation>>(
    ENDPOINTS.consultations.detail(id),
    payload,
  )
  return data.data
}

export async function deleteConsultation(id: string): Promise<void> {
  if (USE_MOCK) {
    mockStore.consultations.remove(id)
    return
  }
  await apiClient.delete(ENDPOINTS.consultations.detail(id))
}

export function buildDossierNumero(patientId: string): string {
  return dossierNumero(patientId)
}
