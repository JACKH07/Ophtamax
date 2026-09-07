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
  const map: Record<string, string> = {
    p1: '84920',
    p2: '84921',
    p3: '84922',
    p4: '84923',
  }
  return map[patientId] ?? patientId.replace(/\D/g, '').slice(-5).padStart(5, '0')
}

let patients: Patient[] = [
  {
    id: 'p1',
    nom: '',
    prenom: '',
    sexe: 'M',
    date_nais: '',
    profession: '',
    contact: '',
    assurance: '',
    antecedents: '',
    derniere_visite: '',
  },
  {
    id: 'p2',
    nom: '',
    prenom: '',
    sexe: 'F',
    date_nais: '',
    profession: '',
    contact: '',
    assurance: '',
    antecedents: '',
    derniere_visite: '',
  },
  {
    id: 'p3',
    nom: '',
    prenom: '',
    sexe: 'M',
    date_nais: '',
    profession: '',
    contact: '',
    assurance: '',
    antecedents: '',
    derniere_visite: '',
  },
  {
    id: 'p4',
    nom: '',
    prenom: '',
    sexe: 'F',
    date_nais: '',
    profession: '',
    contact: '',
    assurance: '',
    antecedents: '',
    derniere_visite: '',
  },
]

let consultations: Consultation[] = [
  {
    id: 'c1',
    id_patient: 'p1',
    patient_name: '',
    dossier_numero: '',
    datecons: '2024-12-10T09:30:00',
    diagnostic: 'Myopie évolutive',
    examen_od: {
      ...emptyOeil(),
      vl_sans: '3/10',
      vl_avec: '10/10',
      sphere: '-2.00',
      cylindre: '-0.50',
      axe: '90',
      pio: '14',
      segment_anterieur: 'RAS',
      fond_oeil: 'Excavation physiologique',
    },
    examen_og: {
      ...emptyOeil(),
      vl_sans: '4/10',
      vl_avec: '10/10',
      sphere: '-1.75',
      cylindre: '-0.25',
      axe: '85',
      pio: '15',
      segment_anterieur: 'RAS',
      fond_oeil: 'RAS',
    },
    ordonnance: 'Correctol 2x/jour\nLarmes artificielles si besoin',
    prescription: 'Lunettes VL\nOD: -2.00 (-0.50) 90°\nOG: -1.75 (-0.25) 85°',
    conduite_a_tenir: 'Contrôle réfraction dans 6 mois. Éviter le travail prolongé sur écran sans pause.',
    prochain_rdv_date: '2025-06-10',
    prochain_rdv_delai: 'Dans 6 mois',
    statut: 'terminee',
  },
  {
    id: 'c2',
    id_patient: 'p2',
    patient_name: '',
    dossier_numero: '',
    datecons: '2024-12-01T14:00:00',
    diagnostic: 'Presbytie',
    examen_od: { ...emptyOeil(), addition: '+2.00', vl_avec: '10/10', vp_avec: 'P2' },
    examen_og: { ...emptyOeil(), addition: '+2.00', vl_avec: '10/10', vp_avec: 'P2' },
    ordonnance: '',
    prescription: 'Verres progressifs\nAdd +2.00',
    conduite_a_tenir: 'Adaptation verres progressifs. Revoir si céphalées.',
    prochain_rdv_date: '2025-01-01',
    prochain_rdv_delai: 'Dans 1 mois',
    statut: 'terminee',
  },
]

// Rendez-vous spread sur les 14 prochains jours (relatifs à aujourd'hui)
function rdvDate(daysOffset: number, hour: number, min = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

let rendezVous: RendezVous[] = [
  {
    id: 'rdv1',
    patient_id: 'p3',
    patient_name: '',
    date_heure: rdvDate(0, 9, 15),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: "Fond d'œil",
    statut: 'en_consultation',
  },
  {
    id: 'rdv2',
    patient_id: 'p4',
    patient_name: '',
    date_heure: rdvDate(0, 9, 45),
    duree_min: 20,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Contrôle post-op',
    statut: 'en_attente',
  },
  {
    id: 'rdv3',
    patient_id: 'p1',
    patient_name: '',
    date_heure: rdvDate(0, 11, 0),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: 'OCT Maculaire',
    statut: 'planifie',
  },
  {
    id: 'rdv4',
    patient_id: 'p2',
    patient_name: '',
    date_heure: rdvDate(0, 14, 30),
    duree_min: 45,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Contrôle réfraction',
    statut: 'planifie',
  },
  {
    id: 'rdv5',
    patient_id: 'p3',
    patient_name: '',
    date_heure: rdvDate(1, 10, 0),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Bilan glaucome',
    statut: 'planifie',
  },
  {
    id: 'rdv6',
    patient_id: 'p4',
    patient_name: '',
    date_heure: rdvDate(2, 9, 0),
    duree_min: 20,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Nouvelle consultation',
    statut: 'planifie',
  },
  {
    id: 'rdv7',
    patient_id: 'p1',
    patient_name: '',
    date_heure: rdvDate(3, 11, 30),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Suivi myopie',
    statut: 'planifie',
  },
  {
    id: 'rdv8',
    patient_id: 'p2',
    patient_name: '',
    date_heure: rdvDate(7, 8, 30),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Champ visuel',
    statut: 'planifie',
  },
  {
    id: 'rdv9',
    patient_id: 'p3',
    patient_name: '',
    date_heure: rdvDate(7, 15, 0),
    duree_min: 45,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Cataracte — suivi',
    statut: 'planifie',
  },
  {
    id: 'rdv10',
    patient_id: 'p4',
    patient_name: '',
    date_heure: rdvDate(-1, 10, 0),
    duree_min: 30,
    medecin_id: 'u2',
    medecin: '',
    motif: 'Rétinopathie — contrôle',
    statut: 'termine',
  },
]

let fileAttente: FileAttenteItem[] = [
  {
    id: 'fa1',
    rdv_id: 'rdv1',
    patient_id: 'p3',
    patient_name: '',
    patient_age: undefined,
    motif: "Fond d'œil",
    heure_arrivee: (() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d.toISOString() })(),
    statut: 'en_consultation',
    priorite: 1,
    medecin: '',
  },
  {
    id: 'fa2',
    rdv_id: 'rdv2',
    patient_id: 'p4',
    patient_name: '',
    patient_age: undefined,
    motif: 'Contrôle post-op',
    heure_arrivee: (() => { const d = new Date(); d.setHours(9, 30, 0, 0); return d.toISOString() })(),
    statut: 'en_attente',
    priorite: 2,
    medecin: '',
  },
  {
    id: 'fa3',
    rdv_id: 'rdv3',
    patient_id: 'p1',
    patient_name: '',
    patient_age: undefined,
    motif: 'OCT Maculaire',
    heure_arrivee: (() => { const d = new Date(); d.setHours(10, 50, 0, 0); return d.toISOString() })(),
    statut: 'en_attente',
    priorite: 3,
    medecin: '',
  },
]

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
  nom: 'New Cabinet Médical d\'Ophtalmologie Kahydara',
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
    top_diagnostics: [
      { label: 'Myopie évolutive', percent: 0 },
      { label: 'Presbytie', percent: 0 },
      { label: 'Cataracte (Dépistage)', percent: 0 },
      { label: 'Glaucome (Suivi)', percent: 0 },
    ],
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
