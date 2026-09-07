import { USE_MOCK } from '@/api/endpoints'
import { dossierNumero, mockStore } from '@/api/mock/dataStore'
import type { Consultation, ExamenOeil } from '@/api/types/entities'

export async function fetchConsultations(): Promise<Consultation[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.consultations.list()
}

export async function fetchConsultation(id: string): Promise<Consultation> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const c = mockStore.consultations.get(id)
  if (!c) throw new Error('Consultation introuvable')
  return c
}

export async function fetchConsultationsByPatient(patientId: string): Promise<Consultation[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.consultations.byPatient(patientId)
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

export async function createConsultation(data: ConsultationFormData): Promise<Consultation> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.consultations.create({
    ...data,
    datecons: new Date().toISOString(),
  })
}

export async function updateConsultation(
  id: string,
  data: ConsultationFormData,
): Promise<Consultation> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.consultations.update(id, data)
}

export async function deleteConsultation(id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.consultations.remove(id)
}

export function buildDossierNumero(patientId: string): string {
  return dossierNumero(patientId)
}
