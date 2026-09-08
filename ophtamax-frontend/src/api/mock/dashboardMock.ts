import type {
  DashboardSummary,
  TopDiagnostic,
  UpcomingSlot,
  WaitingQueueItem,
} from '@/api/types/dashboard'

export const mockDashboardSummary: DashboardSummary = {
  consultations_today: 0,
  consultations_planned: 0,
  patients_waiting: 0,
  average_wait_minutes: 0,
  revenue_today: 0,
  revenue_status: 'À jour',
  new_patients_week: 0,
  new_patients_trend_percent: 0,
}

export const mockWaitingQueue: WaitingQueueItem[] = []

export const mockUpcomingSlots: UpcomingSlot[] = []

export const mockTopDiagnostics: TopDiagnostic[] = []
