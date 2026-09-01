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
  },
} as const
