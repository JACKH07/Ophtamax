import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { Ordonnance, OrdonnanceFormData } from '@/api/types/entities'

function resolvePatientName(patientId: string): string {
  const patient = mockStore.patients.get(patientId)
  if (!patient) return 'Patient inconnu'
  const name = `${patient.nom} ${patient.prenom}`.trim()
  return name || `Patient ${patientId}`
}

export async function fetchOrdonnances(): Promise<Ordonnance[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.ordonnances.list()
}

export async function fetchOrdonnance(id: string): Promise<Ordonnance> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const item = mockStore.ordonnances.get(id)
  if (!item) throw new Error('Ordonnance introuvable')
  return item
}

export async function createOrdonnance(data: OrdonnanceFormData): Promise<Ordonnance> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.ordonnances.create({
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function updateOrdonnance(
  id: string,
  data: OrdonnanceFormData,
): Promise<Ordonnance> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.ordonnances.update(id, {
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function deleteOrdonnance(id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.ordonnances.remove(id)
}
