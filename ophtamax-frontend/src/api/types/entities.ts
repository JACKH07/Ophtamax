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
  motif: string
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

export interface RendezVous {
  id: string
  patient_id: string
  patient_name: string
  date_heure: string
  duree_min: number
  medecin: string
  motif: string
  statut: 'planifie' | 'en_attente' | 'en_consultation' | 'termine' | 'absent'
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

export interface FactureLigne {
  libelle: string
  quantite: number
  prix_unitaire: number
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
