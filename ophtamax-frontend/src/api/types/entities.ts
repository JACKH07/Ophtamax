export interface Patient {
  id: string
  nom: string
  prenom: string
  sexe: 'M' | 'F'
  date_nais: string
  profession: string
  contact: string
  assurance: string
  antecedents: string
  derniere_visite?: string
}

export interface PatientFormData {
  nom: string
  prenom: string
  sexe: 'M' | 'F'
  date_nais: string
  profession: string
  contact: string
  assurance: string
  antecedents: string
}

export interface Consultation {
  id: string
  id_patient: string
  patient_name: string
  dossier_numero: string
  datecons: string
  diagnostic: string
  examen_od: ExamenOeil
  examen_og: ExamenOeil
  ordonnance: string
  prescription: string
  conduite_a_tenir: string
  prochain_rdv_date: string
  prochain_rdv_delai: string
  statut: 'brouillon' | 'terminee'
}

export interface ExamenOeil {
  vl_sans: string
  vl_avec: string
  vp_sans: string
  vp_avec: string
  sphere: string
  cylindre: string
  axe: string
  addition: string
  pio: string
  segment_anterieur: string
  fond_oeil: string
}

export type StatutRdv = 'planifie' | 'en_attente' | 'en_consultation' | 'termine' | 'absent'

export interface RendezVous {
  id: string
  patient_id: string
  patient_name: string
  date_heure: string
  duree_min: number
  medecin_id: string
  medecin: string
  motif: string
  notes?: string
  statut: StatutRdv
}

export interface RendezVousFormData {
  patient_id: string
  date_heure: string
  duree_min: number
  medecin_id: string
  motif: string
  notes?: string
  statut: StatutRdv
}

export type StatutFileAttente = 'en_attente' | 'en_consultation' | 'termine' | 'absent'

export interface FileAttenteItem {
  id: string
  rdv_id: string
  patient_id: string
  patient_name: string
  patient_age?: number
  motif: string
  heure_arrivee: string
  statut: StatutFileAttente
  priorite: number
  medecin: string
}

export interface Facture {
  id: string
  numero: string
  patient_id: string
  patient_name: string
  date: string
  montant_ht: number
  montant_ttc: number
  statut: 'payee' | 'partielle' | 'impayee'
  mode_paiement?: string
  lignes: FactureLigne[]
}

export interface FactureFormData {
  patient_id: string
  date: string
  statut: 'payee' | 'partielle' | 'impayee'
  mode_paiement?: string
  lignes: FactureLigne[]
}

export interface FactureLigne {
  libelle: string
  quantite: number
  prix_unitaire: number
}

export interface PrescriptionExamen {
  id: string
  patient_id: string
  patient_name: string
  date: string
  /** EXAMEN DEMANDÉ */
  examens: string
  /** DIAGNOSTIC (libellé historique : indication) */
  indication: string
  /** Libellé « Bulletin de : … » */
  bulletin_de: string
  /** Champ SERVICE du bulletin */
  service: string
  medecin: string
  notes: string
}

export interface PrescriptionExamenFormData {
  patient_id: string
  date: string
  examens: string
  indication: string
  bulletin_de: string
  service: string
  medecin: string
  notes: string
}

export interface Ordonnance {
  id: string
  patient_id: string
  patient_name: string
  date: string
  contenu: string
  diagnostic: string
  medecin: string
  notes: string
}

export interface OrdonnanceFormData {
  patient_id: string
  date: string
  contenu: string
  diagnostic: string
  medecin: string
  notes: string
}

export interface PrescriptionLunettes {
  id: string
  patient_id: string
  patient_name: string
  date: string
  correction: string
  /** Vision de loin OD */
  od_sphere: string
  od_cylindre: string
  od_axe: string
  od_addition: string
  /** Vision de près OD (si vide, addition utilisée) */
  od_vp_sphere: string
  od_vp_cylindre: string
  od_vp_axe: string
  /** Vision de loin OG */
  og_sphere: string
  og_cylindre: string
  og_axe: string
  og_addition: string
  /** Vision de près OG */
  og_vp_sphere: string
  og_vp_cylindre: string
  og_vp_axe: string
  distance_interpupillaire: string
  /** simple | double | progressif */
  type_foyer: string
  /** Protogray, Anti-reflet, Teinte A, Teinte AB… */
  traitements: string[]
  /** Conservé pour compatibilité */
  type_verre: string
  medecin: string
  notes: string
}

export interface PrescriptionLunettesFormData {
  patient_id: string
  date: string
  correction: string
  od_sphere: string
  od_cylindre: string
  od_axe: string
  od_addition: string
  od_vp_sphere: string
  od_vp_cylindre: string
  od_vp_axe: string
  og_sphere: string
  og_cylindre: string
  og_axe: string
  og_addition: string
  og_vp_sphere: string
  og_vp_cylindre: string
  og_vp_axe: string
  distance_interpupillaire: string
  type_foyer: string
  traitements: string[]
  type_verre: string
  medecin: string
  notes: string
}

export interface AppUser {
  id: string
  nom: string
  prenoms: string
  login_user: string
  email: string
  id_role: 'ADMIN' | 'SEC' | 'OPHT' | 'ASS' | 'COMPTA'
  fonction: string
  actif: boolean
}

export interface ReferentielItem {
  id: string
  code: string
  libelle: string
}

export interface SocieteInfo {
  nom: string
  adresse: string
  contact: string
  slogan: string
}
