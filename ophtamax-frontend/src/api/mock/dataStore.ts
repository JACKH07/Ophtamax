import type {
  AppUser,
  Consultation,
  ExamenOeil,
  Facture,
  FactureFormData,
  FileAttenteItem,
  Ordonnance,
  OrdonnanceFormData,
  Patient,
  PrescriptionExamen,
  PrescriptionExamenFormData,
  PrescriptionLunettes,
  PrescriptionLunettesFormData,
  ReferentielItem,
  RendezVous,
  RendezVousFormData,
  SocieteInfo,
  StatutFileAttente,
  StatutRdv,
} from '@/api/types/entities'

const emptyOeil = (): ExamenOeil => ({
  vl_sans: '',
  vl_avec: '',
  vp_sans: '',
  vp_avec: '',
  sphere: '+0.00',
  cylindre: '-0.00',
  axe: '0',
  addition: '',
  pio: '',
  segment_anterieur: '',
  fond_oeil: '',
})

function dossierNumero(patientId: string): string {
  return patientId.replace(/\D/g, '').slice(-5).padStart(5, '0') || '00001'
}

let patients: Patient[] = []

let consultations: Consultation[] = []

let rendezVous: RendezVous[] = []

let fileAttente: FileAttenteItem[] = []

let factures: Facture[] = []

let prescriptionsExamen: PrescriptionExamen[] = []

let ordonnances: Ordonnance[] = []

let prescriptionsLunettes: PrescriptionLunettes[] = []

let users: AppUser[] = [
  { id: 'u1', nom: '', prenoms: '', login_user: 'opht', email: 'opht@ophtamax.local', id_role: 'OPHT', fonction: 'Ophtalmologiste', actif: true },
  { id: 'u2', nom: '', prenoms: '', login_user: 'secretaire', email: 'sec@ophtamax.local', id_role: 'SEC', fonction: 'Secrétaire', actif: true },
  { id: 'u3', nom: '', prenoms: '', login_user: 'admin', email: 'admin@ophtamax.local', id_role: 'ADMIN', fonction: 'Administrateur', actif: true },
]

let genres: ReferentielItem[] = [
  { id: 'g1', code: 'M', libelle: 'Masculin' },
  { id: 'g2', code: 'F', libelle: 'Féminin' },
]

let professions: ReferentielItem[] = [
  { id: 'pr1', code: 'COMM', libelle: 'Commerçant' },
  { id: 'pr2', code: 'ENS', libelle: 'Enseignant(e)' },
  { id: 'pr3', code: 'MED', libelle: 'Médecin' },
]

let examens: ReferentielItem[] = [
  { id: 'e1', code: 'CV', libelle: 'Champ visuel' },
  { id: 'e2', code: 'RET', libelle: 'Rétinographie' },
  { id: 'e3', code: 'REF', libelle: 'Réfractométrie' },
  { id: 'e4', code: 'OCT', libelle: 'OCT maculaire' },
  { id: 'e5', code: 'FO', libelle: "Fond d'œil dilaté" },
]

let assurances: ReferentielItem[] = [
  { id: 'a1', code: 'MCI', libelle: 'MCI' },
  { id: 'a2', code: 'MUN', libelle: 'MUNASSUR' },
  { id: 'a3', code: 'OLEA', libelle: 'OLEA' },
]

let societe: SocieteInfo = {
  nom: 'Cabinet Médical d\'Ophtalmologie Kahydara',
  adresse: 'Abidjan, Côte d\'Ivoire',
  contact: '+225 27 00 00 00 00',
  slogan: 'Votre vision, notre priorité',
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const mockStore = {
  patients: {
    list: () => [...patients],
    get: (id: string) => patients.find((p) => p.id === id),
    create: (data: Omit<Patient, 'id'>) => {
      const p: Patient = { ...data, id: uid() }
      patients = [p, ...patients]
      return p
    },
    update: (id: string, data: Partial<Patient>) => {
      patients = patients.map((p) => (p.id === id ? { ...p, ...data } : p))
      return patients.find((p) => p.id === id)!
    },
    remove: (id: string) => {
      patients = patients.filter((p) => p.id !== id)
    },
  },
  consultations: {
    list: () => [...consultations],
    get: (id: string) => consultations.find((c) => c.id === id),
    byPatient: (patientId: string) => consultations.filter((c) => c.id_patient === patientId),
    create: (data: Omit<Consultation, 'id'>) => {
      const c: Consultation = { ...data, id: uid() }
      consultations = [c, ...consultations]
      return c
    },
    update: (id: string, data: Partial<Consultation>) => {
      consultations = consultations.map((c) => (c.id === id ? { ...c, ...data } : c))
      return consultations.find((c) => c.id === id)!
    },
    remove: (id: string) => {
      consultations = consultations.filter((c) => c.id !== id)
    },
  },
  rendezVous: {
    list: (from?: string, to?: string, medecin_id?: string) => {
      let list = [...rendezVous]
      if (from) list = list.filter((r) => r.date_heure >= from)
      if (to) list = list.filter((r) => r.date_heure <= to)
      if (medecin_id) list = list.filter((r) => r.medecin_id === medecin_id)
      return list.sort((a, b) => a.date_heure.localeCompare(b.date_heure))
    },
    get: (id: string) => rendezVous.find((r) => r.id === id),
    create: (data: RendezVousFormData & { patient_name: string; medecin: string }) => {
      const r: RendezVous = { ...data, id: uid() }
      rendezVous = [...rendezVous, r]
      rendezVous.sort((a, b) => a.date_heure.localeCompare(b.date_heure))
      return r
    },
    update: (id: string, data: Partial<RendezVousFormData>) => {
      rendezVous = rendezVous.map((r) => (r.id === id ? { ...r, ...data } : r))
      return rendezVous.find((r) => r.id === id)!
    },
    updateStatut: (id: string, statut: StatutRdv) => {
      rendezVous = rendezVous.map((r) => (r.id === id ? { ...r, statut } : r))
      return rendezVous.find((r) => r.id === id)!
    },
    remove: (id: string) => {
      rendezVous = rendezVous.filter((r) => r.id !== id)
    },
  },
  fileAttente: {
    list: (date?: string) => {
      if (!date) return [...fileAttente]
      return fileAttente.filter((f) => f.heure_arrivee.startsWith(date))
    },
    add: (patient_id: string, patient_name: string, motif: string, rdv_id: string, medecin: string, priorite?: number) => {
      const item: FileAttenteItem = {
        id: uid(),
        rdv_id,
        patient_id,
        patient_name,
        motif,
        heure_arrivee: new Date().toISOString(),
        statut: 'en_attente',
        priorite: priorite ?? fileAttente.length + 1,
        medecin,
      }
      fileAttente = [...fileAttente, item]
      return item
    },
    updateStatut: (id: string, statut: StatutFileAttente) => {
      fileAttente = fileAttente.map((f) => (f.id === id ? { ...f, statut } : f))
      return fileAttente.find((f) => f.id === id)!
    },
  },
  factures: {
    list: () => [...factures],
    get: (id: string) => factures.find((f) => f.id === id),
    create: (data: FactureFormData & { patient_name: string }) => {
      const total = data.lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0)
      const year = new Date().getFullYear()
      const seq = String(factures.length + 1).padStart(4, '0')
      const f: Facture = {
        id: uid(),
        numero: `FAC-${year}-${seq}`,
        patient_id: data.patient_id,
        patient_name: data.patient_name,
        date: data.date.slice(0, 10),
        montant_ht: total,
        montant_ttc: total,
        statut: data.statut,
        mode_paiement: data.mode_paiement,
        lignes: data.lignes,
      }
      factures = [f, ...factures]
      return f
    },
    caisseJour: () => {
      const today = new Date().toISOString().slice(0, 10)
      const duJour = factures.filter((f) => f.date.startsWith(today))
      const total = duJour.filter((f) => f.statut === 'payee').reduce((s, f) => s + f.montant_ttc, 0)
      return { total, count: duJour.length, factures: duJour }
    },
  },
  prescriptionsExamen: {
    list: () => [...prescriptionsExamen],
    get: (id: string) => prescriptionsExamen.find((p) => p.id === id),
    create: (data: PrescriptionExamenFormData & { patient_name: string }) => {
      const item: PrescriptionExamen = { ...data, id: uid() }
      prescriptionsExamen = [item, ...prescriptionsExamen]
      return item
    },
    update: (id: string, data: Partial<PrescriptionExamenFormData> & { patient_name?: string }) => {
      prescriptionsExamen = prescriptionsExamen.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      )
      return prescriptionsExamen.find((p) => p.id === id)!
    },
    remove: (id: string) => {
      prescriptionsExamen = prescriptionsExamen.filter((p) => p.id !== id)
    },
  },
  ordonnances: {
    list: () => [...ordonnances],
    get: (id: string) => ordonnances.find((o) => o.id === id),
    create: (data: OrdonnanceFormData & { patient_name: string }) => {
      const item: Ordonnance = { ...data, id: uid() }
      ordonnances = [item, ...ordonnances]
      return item
    },
    update: (id: string, data: Partial<OrdonnanceFormData> & { patient_name?: string }) => {
      ordonnances = ordonnances.map((o) => (o.id === id ? { ...o, ...data } : o))
      return ordonnances.find((o) => o.id === id)!
    },
    remove: (id: string) => {
      ordonnances = ordonnances.filter((o) => o.id !== id)
    },
  },
  prescriptionsLunettes: {
    list: () => [...prescriptionsLunettes],
    get: (id: string) => prescriptionsLunettes.find((p) => p.id === id),
    create: (data: PrescriptionLunettesFormData & { patient_name: string }) => {
      const item: PrescriptionLunettes = { ...data, id: uid() }
      prescriptionsLunettes = [item, ...prescriptionsLunettes]
      return item
    },
    update: (id: string, data: Partial<PrescriptionLunettesFormData> & { patient_name?: string }) => {
      prescriptionsLunettes = prescriptionsLunettes.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      )
      return prescriptionsLunettes.find((p) => p.id === id)!
    },
    remove: (id: string) => {
      prescriptionsLunettes = prescriptionsLunettes.filter((p) => p.id !== id)
    },
  },
  users: {
    list: () => [...users],
    get: (id: string) => users.find((u) => u.id === id),
    create: (data: Omit<AppUser, 'id'>) => {
      const u: AppUser = { ...data, id: uid() }
      users = [u, ...users]
      return u
    },
    update: (id: string, data: Partial<AppUser>) => {
      users = users.map((u) => (u.id === id ? { ...u, ...data } : u))
      return users.find((u) => u.id === id)!
    },
    remove: (id: string) => {
      users = users.filter((u) => u.id !== id)
    },
  },
  referentiels: {
    genres: () => [...genres],
    professions: () => [...professions],
    examens: () => [...examens],
    assurances: () => [...assurances],
    societe: () => ({ ...societe }),
    updateSociete: (data: Partial<SocieteInfo>) => {
      societe = { ...societe, ...data }
      return societe
    },
  },
  statistiques: () => ({
    consultations_mois: 0,
    consultations_evolution: 0,
    ca_mois: 0,
    ca_evolution: 0,
    nouveaux_patients: 0,
    taux_occupation: 0,
    top_diagnostics: [] as { label: string; percent: number }[],
    consultations_par_mois: [
      { mois: 'Juil', value: 0 },
      { mois: 'Août', value: 0 },
      { mois: 'Sep', value: 0 },
      { mois: 'Oct', value: 0 },
      { mois: 'Nov', value: 0 },
      { mois: 'Déc', value: 0 },
    ],
  }),
}

export { emptyOeil, dossierNumero }
