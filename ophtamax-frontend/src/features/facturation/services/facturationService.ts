import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { Facture, FactureFormData } from '@/api/types/entities'

export async function fetchFactures(): Promise<Facture[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.factures.list()
}

export async function fetchFacture(id: string): Promise<Facture> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const f = mockStore.factures.get(id)
  if (!f) throw new Error('Facture introuvable')
  return f
}

export async function createFacture(data: FactureFormData): Promise<Facture> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const patient = mockStore.patients.get(data.patient_id)
  const patient_name = patient
    ? `${patient.nom} ${patient.prenom}`.trim() || `Patient ${data.patient_id}`
    : 'Patient inconnu'
  return mockStore.factures.create({ ...data, patient_name })
}

export async function fetchCaisseJour() {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.factures.caisseJour()
}
