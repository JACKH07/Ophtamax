import { USE_MOCK } from '@/api/endpoints'
import { mockStore } from '@/api/mock/dataStore'
import type { Patient, PatientFormData } from '@/api/types/entities'

export async function fetchPatients(search?: string): Promise<Patient[]> {
  if (!USE_MOCK) throw new Error('API non disponible')
  let list = mockStore.patients.list()
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (p) =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.contact.includes(q),
    )
  }
  return list
}

export async function fetchPatient(id: string): Promise<Patient> {
  if (!USE_MOCK) throw new Error('API non disponible')
  const p = mockStore.patients.get(id)
  if (!p) throw new Error('Patient introuvable')
  return p
}

export async function createPatient(data: PatientFormData): Promise<Patient> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.patients.create({ ...data, derniere_visite: undefined })
}

export async function updatePatient(id: string, data: PatientFormData): Promise<Patient> {
  if (!USE_MOCK) throw new Error('API non disponible')
  return mockStore.patients.update(id, data)
}

export async function deletePatient(id: string): Promise<void> {
  if (!USE_MOCK) throw new Error('API non disponible')
  mockStore.patients.remove(id)
}
