import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { ReferentielItem, SocieteInfo } from '@/api/types/entities'

export type ReferentielKind = 'professions' | 'assurances' | 'examens'

export async function fetchSociete(): Promise<SocieteInfo> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.referentiels.societe()
}

export async function updateSociete(data: Partial<SocieteInfo>): Promise<SocieteInfo> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.referentiels.updateSociete(data)
}

export async function fetchReferentiel(kind: ReferentielKind): Promise<ReferentielItem[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  if (kind === 'professions') return mockStore.referentiels.professions()
  if (kind === 'assurances') return mockStore.referentiels.assurances()
  return mockStore.referentiels.examens()
}

export async function addReferentiel(
  kind: ReferentielKind,
  data: { code: string; libelle: string },
): Promise<ReferentielItem> {
  if (!USE_MOCK) throw new Error('API non disponible')
  if (kind === 'professions') return mockStore.referentiels.addProfession(data)
  if (kind === 'assurances') return mockStore.referentiels.addAssurance(data)
  return mockStore.referentiels.addExamen(data)
}

export async function removeReferentiel(kind: ReferentielKind, id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  if (kind === 'professions') mockStore.referentiels.removeProfession(id)
  else if (kind === 'assurances') mockStore.referentiels.removeAssurance(id)
  else mockStore.referentiels.removeExamen(id)
}
