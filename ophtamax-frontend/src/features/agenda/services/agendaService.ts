import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type {
  FileAttenteItem,
  RendezVous,
  RendezVousFormData,
  StatutFileAttente,
  StatutRdv,
} from '@/api/types/entities'

// ── Helpers pour retrouver le patient_name et medecin depuis les données mock
function resolveNames(data: RendezVousFormData): { patient_name: string; medecin: string } {
  const patient = mockStore.patients.get(data.patient_id)
  return {
    patient_name: patient ? `${patient.nom} ${patient.prenom}`.trim() || `Patient ${data.patient_id}` : 'Patient inconnu',
    medecin: '',
  }
}

// ── Rendez-vous ──────────────────────────────────────────────────────────────

export async function fetchRendezVous(params?: {
  from?: string
  to?: string
  medecin_id?: string
}): Promise<RendezVous[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.rendezVous.list(params?.from, params?.to, params?.medecin_id)
}

export async function fetchRendezVousById(id: string): Promise<RendezVous> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const rdv = mockStore.rendezVous.get(id)
  if (!rdv) throw new Error(`RDV ${id} introuvable`)
  return rdv
}

export async function createRendezVous(data: RendezVousFormData): Promise<RendezVous> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const names = resolveNames(data)
  return mockStore.rendezVous.create({ ...data, ...names })
}

export async function updateRendezVous(
  id: string,
  data: Partial<RendezVousFormData>,
): Promise<RendezVous> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.rendezVous.update(id, data)
}

export async function updateRdvStatut(id: string, statut: StatutRdv): Promise<RendezVous> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.rendezVous.updateStatut(id, statut)
}

export async function deleteRendezVous(id: string): Promise<{ message: string }> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.rendezVous.remove(id)
  return { message: 'Rendez-vous supprimé.' }
}

// ── File d'attente ───────────────────────────────────────────────────────────

export async function fetchFileAttente(date?: string): Promise<FileAttenteItem[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.fileAttente.list(date)
}

export async function addToFileAttente(payload: {
  patient_id: string
  rdv_id: string
  medecin: string
  motif: string
  priorite?: number
}): Promise<FileAttenteItem> {
  if (!USE_MOCK) throw new Error('API non disponible')
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

export async function updateFileAttenteStatut(
  id: string,
  statut: StatutFileAttente,
): Promise<FileAttenteItem> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.fileAttente.updateStatut(id, statut)
}
