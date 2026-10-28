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
  if (data.patient_id) {
    const patient = mockStore.patients.get(data.patient_id)
    if (patient) {
      return {
        patient_name: `${patient.nom} ${patient.prenom}`.trim() || `Patient ${data.patient_id}`,
        medecin: '',
      }
    }
  }
  return {
    patient_name: (data.patient_name ?? '').trim() || 'Patient',
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
  const { data } = await apiClient.get<ApiResponse<RendezVous>>(`${ENDPOINTS.agenda.rendezVous}/${id}`)
  return data.data
}

export async function createRendezVous(payload: RendezVousFormData): Promise<RendezVous> {
  if (USE_MOCK) {
    const names = resolveNames(payload)
    return mockStore.rendezVous.create({ ...payload, ...names })
  }
  const { data } = await apiClient.post<ApiResponse<RendezVous>>(ENDPOINTS.agenda.rendezVous, payload)
  return data.data
}

export async function updateRendezVous(
  id: string,
  payload: Partial<RendezVousFormData>,
): Promise<RendezVous> {
  if (USE_MOCK) return mockStore.rendezVous.update(id, payload)
  const { data } = await apiClient.put<ApiResponse<RendezVous>>(`${ENDPOINTS.agenda.rendezVous}/${id}`, payload)
  return data.data
}

export async function updateRdvStatut(id: string, statut: StatutRdv): Promise<RendezVous> {
  if (USE_MOCK) return mockStore.rendezVous.updateStatut(id, statut)
  const { data } = await apiClient.put<ApiResponse<RendezVous>>(`${ENDPOINTS.agenda.rendezVous}/${id}`, { statut })
  return data.data
}

export async function deleteRendezVous(id: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    mockStore.rendezVous.remove(id)
    return { message: 'Rendez-vous supprimé.' }
  }
  await apiClient.delete(`${ENDPOINTS.agenda.rendezVous}/${id}`)
  return { message: 'Rendez-vous supprimé.' }
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
  const { data } = await apiClient.post<ApiResponse<FileAttenteItem>>(ENDPOINTS.agenda.fileAttente, payload)
  return data.data
}

export async function updateFileAttenteStatut(
  id: string,
  statut: StatutFileAttente,
): Promise<FileAttenteItem> {
  if (USE_MOCK) return mockStore.fileAttente.updateStatut(id, statut)
  const { data } = await apiClient.put<ApiResponse<FileAttenteItem>>(
    `${ENDPOINTS.agenda.fileAttente}/${id}`,
    { statut },
  )
  return data.data
}
