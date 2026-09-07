import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { PrescriptionLunettes, PrescriptionLunettesFormData } from '@/api/types/entities'

function resolvePatientName(patientId: string): string {
  const patient = mockStore.patients.get(patientId)
  if (!patient) return 'Patient inconnu'
  const name = `${patient.nom} ${patient.prenom}`.trim()
  return name || `Patient ${patientId}`
}

export async function fetchPrescriptionsLunettes(): Promise<PrescriptionLunettes[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsLunettes.list()
}

export async function fetchPrescriptionLunettes(id: string): Promise<PrescriptionLunettes> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const item = mockStore.prescriptionsLunettes.get(id)
  if (!item) throw new Error('Prescription lunettes introuvable')
  return item
}

export async function createPrescriptionLunettes(
  data: PrescriptionLunettesFormData,
): Promise<PrescriptionLunettes> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsLunettes.create({
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function updatePrescriptionLunettes(
  id: string,
  data: PrescriptionLunettesFormData,
): Promise<PrescriptionLunettes> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.prescriptionsLunettes.update(id, {
    ...data,
    patient_name: resolvePatientName(data.patient_id),
  })
}

export async function deletePrescriptionLunettes(id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.prescriptionsLunettes.remove(id)
}
