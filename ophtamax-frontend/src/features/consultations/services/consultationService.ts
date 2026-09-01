import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
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

export interface ConsultationFormData {
  id_patient: string
  patient_name: string
  motif: string
  diagnostic: string
  examen_od: ExamenOeil
  examen_og: ExamenOeil
  ordonnance: string
  prescription: string
}

export async function createConsultation(data: ConsultationFormData): Promise<Consultation> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.consultations.create({
    ...data,
    datecons: new Date().toISOString(),
    statut: 'terminee',
  })
}
