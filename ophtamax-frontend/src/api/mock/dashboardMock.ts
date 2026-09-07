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

export const mockUpcomingSlots: UpcomingSlot[] = [
  {
    id: '1',
    start_time: '11:00',
    end_time: '11:30',
    title: 'OCT Maculaire',
    patient_name: 'S. Benali',
    variant: 'primary',
  },
  {
    id: '2',
    start_time: '11:45',
    end_time: '12:00',
    title: 'Pause administrative',
    variant: 'secondary',
  },
  {
    id: '3',
    start_time: '13:30',
    end_time: '14:00',
    title: 'Chirurgie cataracte (Bloc)',
    variant: 'primary',
  },
]

export const mockTopDiagnostics: TopDiagnostic[] = [
  { label: 'Myopie évolutive', percent: 0 },
  { label: 'Presbytie', percent: 0 },
  { label: 'Cataracte (Dépistage)', percent: 0 },
  { label: 'Glaucome (Suivi)', percent: 0 },
]
