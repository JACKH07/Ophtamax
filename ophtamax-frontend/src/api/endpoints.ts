export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  dashboard: {
    summary: '/dashboard/summary',
    waitingQueue: '/dashboard/waiting-queue',
    upcomingSlots: '/dashboard/upcoming-slots',
    topDiagnostics: '/dashboard/top-diagnostics',
    charts: '/dashboard/charts',
  },
  patients: {
    list: '/patients',
    detail: (id: string) => `/patients/${id}`,
    consultations: (id: string) => `/patients/${id}/consultations`,
  },
  consultations: {
    list: '/consultations',
    detail: (id: string) => `/consultations/${id}`,
  },
  agenda: {
    rendezVous: '/agenda/rendez-vous',
    fileAttente: '/agenda/file-attente',
  },
  ordonnances: {
    list: '/ordonnances',
    detail: (id: string) => `/ordonnances/${id}`,
  },
  prescriptionsExamen: {
    list: '/prescriptions-examen',
    detail: (id: string) => `/prescriptions-examen/${id}`,
  },
  prescriptionsLunettes: {
    list: '/prescriptions-lunettes',
    detail: (id: string) => `/prescriptions-lunettes/${id}`,
  },
  facturation: {
    factures: '/factures',
    factureDetail: (id: string) => `/factures/${id}`,
    caisseJour: '/caisse/jour',
  },
  statistiques: {
    summary: '/statistiques',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  referentiels: {
    genres: '/referentiels/genres',
    professions: '/referentiels/professions',
    examens: '/referentiels/examens',
    assurances: '/referentiels/assurances',
    roles: '/referentiels/roles',
  },
  parametres: {
    societe: '/parametres/societe',
  },
} as const
