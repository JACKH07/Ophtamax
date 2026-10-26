import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ApiResponse } from '@/api/types/auth'
import type { ReferentielItem, SocieteInfo } from '@/api/types/entities'

export type ReferentielKind = 'professions' | 'assurances' | 'examens'

export async function fetchSociete(): Promise<SocieteInfo> {
  if (USE_MOCK) return mockStore.referentiels.societe()
  const { data } = await apiClient.get<ApiResponse<SocieteInfo>>(ENDPOINTS.parametres.societe)
  return data.data
}

export async function updateSociete(payload: Partial<SocieteInfo>): Promise<SocieteInfo> {
  if (USE_MOCK) return mockStore.referentiels.updateSociete(payload)
  const { data } = await apiClient.put<ApiResponse<SocieteInfo>>(
    ENDPOINTS.parametres.societe,
    payload,
  )
  return data.data
}

export async function fetchGenres(): Promise<ReferentielItem[]> {
  if (USE_MOCK) return mockStore.referentiels.genres()
  const { data } = await apiClient.get<ApiResponse<ReferentielItem[]>>(ENDPOINTS.referentiels.genres)
  return data.data
}

export async function fetchReferentiel(kind: ReferentielKind): Promise<ReferentielItem[]> {
  if (USE_MOCK) {
    if (kind === 'professions') return mockStore.referentiels.professions()
    if (kind === 'assurances') return mockStore.referentiels.assurances()
    return mockStore.referentiels.examens()
  }
  const url =
    kind === 'professions'
      ? ENDPOINTS.referentiels.professions
      : kind === 'assurances'
        ? ENDPOINTS.referentiels.assurances
        : ENDPOINTS.referentiels.examens
  const { data } = await apiClient.get<ApiResponse<ReferentielItem[]>>(url)
  return data.data
}

function referentielUrl(kind: ReferentielKind): string {
  if (kind === 'professions') return ENDPOINTS.referentiels.professions
  if (kind === 'assurances') return ENDPOINTS.referentiels.assurances
  return ENDPOINTS.referentiels.examens
}

export async function addReferentiel(
  kind: ReferentielKind,
  payload: { code: string; libelle: string },
): Promise<ReferentielItem> {
  if (USE_MOCK) {
    if (kind === 'professions') return mockStore.referentiels.addProfession(payload)
    if (kind === 'assurances') return mockStore.referentiels.addAssurance(payload)
    return mockStore.referentiels.addExamen(payload)
  }
  const { data } = await apiClient.post<ApiResponse<ReferentielItem>>(referentielUrl(kind), payload)
  return data.data
}

export async function removeReferentiel(kind: ReferentielKind, id: string): Promise<void> {
  if (USE_MOCK) {
    if (kind === 'professions') mockStore.referentiels.removeProfession(id)
    else if (kind === 'assurances') mockStore.referentiels.removeAssurance(id)
    else mockStore.referentiels.removeExamen(id)
    return
  }
  await apiClient.delete(`${referentielUrl(kind)}/${id}`)
}
