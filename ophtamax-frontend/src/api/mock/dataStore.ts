import type {
  AppUser,
  Consultation,
  ExamenOeil,
  Facture,
  Patient,
  ReferentielItem,
  RendezVous,
  SocieteInfo,
} from '@/api/types/entities'

const emptyOeil = (): ExamenOeil => ({
  avl: '',
  sphere: '',
  cylindre: '',
  axe: '',
  addition: '',
  pio: '',
  fond_oeil: '',
})

let patients: Patient[] = [
  {
    id: 'p1',
    nom: 'Sylla',
    prenom: 'Diallo',
    sexe: 'M',
    date_nais: '1985-03-12',
    profession: 'Commerçant',
    contact: '07 08 12 34 56',
    assurance: 'MCI',
    antecedents: 'Diabète type 2',
    derniere_visite: '2024-11-15',
  },
  {
    id: 'p2',
    nom: 'Laurent',
    prenom: 'Marie',
    sexe: 'F',
    date_nais: '1992-07-22',
    profession: 'Enseignante',
    contact: '05 44 22 11 00',
    assurance: 'MUNASSUR',
    antecedents: '',
    derniere_visite: '2024-12-01',
  },
  {
    id: 'p3',
    nom: 'Dupont',
    prenom: 'Jean',
    sexe: 'M',
    date_nais: '1978-01-05',
    profession: 'Chauffeur',
    contact: '01 02 03 04 05',
    assurance: '',
    antecedents: 'Hypertension',
    derniere_visite: '2024-10-20',
  },
  {
    id: 'p4',
    nom: 'Traoré',
    prenom: 'Awa',
    sexe: 'F',
    date_nais: '1995-11-30',
    profession: 'Infirmière',
    contact: '07 77 88 99 00',
    assurance: 'OLEA',
    antecedents: '',
    derniere_visite: '2024-12-10',
  },
]

let consultations: Consultation[] = [
  {
    id: 'c1',
    id_patient: 'p1',
    patient_name: 'Diallo Sylla',
    datecons: '2024-12-10T09:30:00',
    diagnostic: 'Myopie évolutive',
    motif: 'Baisse de vision de loin',
    examen_od: { ...emptyOeil(), sphere: '-2.00', cylindre: '-0.50', axe: '90', avl: '10/10' },
    examen_og: { ...emptyOeil(), sphere: '-1.75', cylindre: '-0.25', axe: '85', avl: '10/10' },
    ordonnance: 'Correctol 2x/jour',
    prescription: 'Lunettes VL',
    statut: 'terminee',
  },
  {
    id: 'c2',
    id_patient: 'p2',
    patient_name: 'Marie Laurent',
    datecons: '2024-12-01T14:00:00',
    diagnostic: 'Presbytie',
    motif: 'Contrôle visuel',
    examen_od: { ...emptyOeil(), addition: '+2.00' },
    examen_og: { ...emptyOeil(), addition: '+2.00' },
    ordonnance: '',
    prescription: 'Verres progressifs',
    statut: 'terminee',
  },
]

let rendezVous: RendezVous[] = [
  {
    id: 'rdv1',
    patient_id: 'p3',
    patient_name: 'Jean Dupont',
    date_heure: '2024-12-12T09:15:00',
    duree_min: 30,
    medecin: 'Dr Koffi',
    motif: 'Fond d\'œil',
    statut: 'en_consultation',
  },
  {
    id: 'rdv2',
    patient_id: 'p4',
    patient_name: 'Awa Traoré',
    date_heure: '2024-12-12T09:45:00',
    duree_min: 20,
    medecin: 'Dr Koffi',
    motif: 'Contrôle post-op',
    statut: 'en_attente',
  },
  {
    id: 'rdv3',
    patient_id: 'p1',
    patient_name: 'Diallo Sylla',
    date_heure: '2024-12-12T11:00:00',
    duree_min: 30,
    medecin: 'Dr Koffi',
    motif: 'OCT Maculaire',
    statut: 'planifie',
  },
]

let factures: Facture[] = [
  {
    id: 'f1',
    numero: 'FAC-2024-0892',
    patient_id: 'p1',
    patient_name: 'Diallo Sylla',
    date: '2024-12-10',
    montant_ht: 45000,
    montant_ttc: 45000,
    statut: 'payee',
    mode_paiement: 'Espèces',
    lignes: [
      { libelle: 'Consultation ophtalmologique', quantite: 1, prix_unitaire: 25000 },
      { libelle: 'Fond d\'œil', quantite: 1, prix_unitaire: 20000 },
    ],
  },
  {
    id: 'f2',
    numero: 'FAC-2024-0893',
    patient_id: 'p2',
    patient_name: 'Marie Laurent',
    date: '2024-12-11',
    montant_ht: 35000,
    montant_ttc: 35000,
    statut: 'partielle',
    mode_paiement: 'CB',
    lignes: [{ libelle: 'Consultation + réfraction', quantite: 1, prix_unitaire: 35000 }],
  },
  {
    id: 'f3',
    numero: 'FAC-2024-0894',
    patient_id: 'p3',
    patient_name: 'Jean Dupont',
    date: '2024-12-11',
    montant_ht: 15000,
    montant_ttc: 15000,
    statut: 'impayee',
    lignes: [{ libelle: 'Champ visuel', quantite: 1, prix_unitaire: 15000 }],
  },
]

let users: AppUser[] = [
  { id: 'u1', nom: 'Koffi', prenoms: 'Jean', login_user: 'opht', email: 'jkoffi@ophtamax.local', id_role: 'OPHT', fonction: 'Ophtalmologiste', actif: true },
  { id: 'u2', nom: 'Amani', prenoms: 'Fatou', login_user: 'secretaire', email: 'sec@ophtamax.local', id_role: 'SEC', fonction: 'Secrétaire', actif: true },
  { id: 'u3', nom: 'Admin', prenoms: 'Système', login_user: 'admin', email: 'admin@ophtamax.local', id_role: 'ADMIN', fonction: 'Administrateur', actif: true },
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
]

let assurances: ReferentielItem[] = [
  { id: 'a1', code: 'MCI', libelle: 'MCI' },
  { id: 'a2', code: 'MUN', libelle: 'MUNASSUR' },
  { id: 'a3', code: 'OLEA', libelle: 'OLEA' },
]

let societe: SocieteInfo = {
  nom: 'Centre d\'Ophtalmologie Saint-Louis',
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
  },
  rendezVous: {
    list: () => [...rendezVous],
    updateStatut: (id: string, statut: RendezVous['statut']) => {
      rendezVous = rendezVous.map((r) => (r.id === id ? { ...r, statut } : r))
      return rendezVous.find((r) => r.id === id)!
    },
    create: (data: Omit<RendezVous, 'id'>) => {
      const r: RendezVous = { ...data, id: uid() }
      rendezVous = [r, ...rendezVous]
      return r
    },
  },
  factures: {
    list: () => [...factures],
    get: (id: string) => factures.find((f) => f.id === id),
    caisseJour: () => {
      const today = new Date().toISOString().slice(0, 10)
      const duJour = factures.filter((f) => f.date === today || f.statut === 'payee')
      const total = duJour.filter((f) => f.statut === 'payee').reduce((s, f) => s + f.montant_ttc, 0)
      return { total, count: duJour.length, factures: duJour }
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
    consultations_mois: 342,
    consultations_evolution: 8,
    ca_mois: 12500000,
    ca_evolution: 12,
    nouveaux_patients: 48,
    taux_occupation: 78,
    top_diagnostics: [
      { label: 'Myopie évolutive', percent: 35 },
      { label: 'Presbytie', percent: 28 },
      { label: 'Cataracte (Dépistage)', percent: 18 },
      { label: 'Glaucome (Suivi)', percent: 12 },
    ],
    consultations_par_mois: [
      { mois: 'Juil', value: 280 },
      { mois: 'Août', value: 310 },
      { mois: 'Sep', value: 295 },
      { mois: 'Oct', value: 320 },
      { mois: 'Nov', value: 335 },
      { mois: 'Déc', value: 342 },
    ],
  }),
}

export { emptyOeil }
