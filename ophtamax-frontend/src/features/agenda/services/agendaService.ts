import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type {
  FileAttenteItem,
  RendezVous,
  RendezVousFormData,
  StatutFileAttente,
  StatutRdv,
} from '@/api/types/entities'

function resolveNames(data: RendezVousFormData): { patient_name: string; medecin: string } {
  const patient = mockStore.patients.get(data.patient_id)
  return {
    patient_name: patient
      ? `${patient.nom} ${patient.prenom}`.trim() || `Patient ${data.patient_id}`
      : 'Patient inconnu',
    medecin: '',
  }
}

export async function fetchRendezVous(params?: {
  from?: string
  to?: string
  medecin_id?: string
}): Promise<RendezVous[]> {
  if (USE_MOCK) return mockStore.rendezVous.list(params?.from, params?.to, params?.medecin_id)
  const { data } = await apiClient.get<ApiResponse<RendezVous[]>>(ENDPOINTS.agenda.rendezVous, {
    params,
  })
  return data.data
}

export async function fetchRendezVousById(id: string): Promise<RendezVous> {
  if (USE_MOCK) {
    const rdv = mockStore.rendezVous.get(id)
    if (!rdv) throw new Error(`RDV ${id} introuvable`)
    return rdv
  }
  const list = await fetchRendezVous()
  const rdv = list.find((item) => item.id === id)
  if (!rdv) throw new Error(`RDV ${id} introuvable`)
  return rdv
}

export async function createRendezVous(payload: RendezVousFormData): Promise<RendezVous> {
  if (USE_MOCK) {
    const names = resolveNames(payload)
    return mockStore.rendezVous.create({ ...payload, ...names })
  }
  throw new Error('Agenda : création non disponible (pas de table RDV en BDD v1)')
}

export async function updateRendezVous(
  id: string,
  payload: Partial<RendezVousFormData>,
): Promise<RendezVous> {
  if (USE_MOCK) return mockStore.rendezVous.update(id, payload)
  throw new Error('Agenda : mise à jour non disponible')
}

export async function updateRdvStatut(id: string, statut: StatutRdv): Promise<RendezVous> {
  if (USE_MOCK) return mockStore.rendezVous.updateStatut(id, statut)
  throw new Error('Agenda : mise à jour non disponible')
}

export async function deleteRendezVous(id: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    mockStore.rendezVous.remove(id)
    return { message: 'Rendez-vous supprimé.' }
  }
  throw new Error('Agenda : suppression non disponible')
}

export async function fetchFileAttente(date?: string): Promise<FileAttenteItem[]> {
  if (USE_MOCK) return mockStore.fileAttente.list(date)
  const { data } = await apiClient.get<ApiResponse<FileAttenteItem[]>>(ENDPOINTS.agenda.fileAttente, {
    params: { date },
  })
  return data.data
}

export async function addToFileAttente(payload: {
  patient_id: string
  rdv_id: string
  medecin: string
  motif: string
  priorite?: number
}): Promise<FileAttenteItem> {
  if (USE_MOCK) {
    const patient = mockStore.patients.get(payload.patient_id)
    const patient_name = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu'
    return mockStore.fileAttente.add(
      payload.patient_id,
      patient_name,
      payload.motif,
      payload.rdv_id,
      payload.medecin,
      payload.priorite,
    )
  }
  throw new Error('File d\'attente : ajout non disponible')
}

export async function updateFileAttenteStatut(
  id: string,
  statut: StatutFileAttente,
): Promise<FileAttenteItem> {
  if (USE_MOCK) return mockStore.fileAttente.updateStatut(id, statut)
  throw new Error('File d\'attente : mise à jour non disponible')
}
