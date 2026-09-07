import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { PrescriptionExamen, PrescriptionExamenFormData } from '@/api/types/entities'

function resolvePatientName(patientId: string): string {
  const patient = mockStore.patients.get(patientId)
  if (!patient) return 'Patient inconnu'
  const name = `${patient.nom} ${patient.prenom}`.trim()
  return name || `Patient ${patientId}`
}

export async function fetchPrescriptionsExamen(): Promise<PrescriptionExamen[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsExamen.list()
}

export async function fetchPrescriptionExamen(id: string): Promise<PrescriptionExamen> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const item = mockStore.prescriptionsExamen.get(id)
  if (!item) throw new Error('Prescription examen introuvable')
  return item
}

export async function createPrescriptionExamen(
  data: PrescriptionExamenFormData,
): Promise<PrescriptionExamen> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsExamen.create({
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function updatePrescriptionExamen(
  id: string,
  data: PrescriptionExamenFormData,
): Promise<PrescriptionExamen> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsExamen.update(id, {
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function deletePrescriptionExamen(id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.prescriptionsExamen.remove(id)
}
