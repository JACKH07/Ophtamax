import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import type {
  DashboardCharts,
  DashboardSummary,
  TopDiagnostic,
  UpcomingSlot,
  WaitingQueueItem,
} from '@/api/types/dashboard'

dayjs.locale('fr')

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

export const mockTopDiagnostics: TopDiagnostic[] = [
  { label: 'Myopie', percent: 32 },
  { label: 'Cataracte', percent: 24 },
  { label: 'Glaucome', percent: 18 },
  { label: 'Conjonctivite', percent: 14 },
  { label: 'Autres', percent: 12 },
]

function buildActivity7d(): DashboardCharts['activity_7d'] {
  const consultations = [8, 11, 9, 14, 12, 6, 12]
  const recettes = [320000, 410000, 355000, 520000, 485000, 210000, 485000]

  return Array.from({ length: 7 }, (_, index) => {
    const day = dayjs().subtract(6 - index, 'day')
    return {
      date: day.format('YYYY-MM-DD'),
      label: day.format('ddd'),
      consultations: consultations[index] ?? 0,
      recettes: recettes[index] ?? 0,
    }
  })
}

export const mockDashboardCharts: DashboardCharts = {
  activity_7d: buildActivity7d(),
  diagnostics: mockTopDiagnostics,
}
