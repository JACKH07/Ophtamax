import type {
  DashboardSummary,
  TopDiagnostic,
  UpcomingSlot,
  WaitingQueueItem,
} from '@/api/types/dashboard'

export const mockDashboardSummary: DashboardSummary = {
  consultations_today: 42,
  consultations_planned: 3,
  patients_waiting: 12,
  average_wait_minutes: 15,
  revenue_today: 2450,
  revenue_status: 'À jour',
  new_patients_week: 28,
  new_patients_trend_percent: 12,
}

export const mockWaitingQueue: WaitingQueueItem[] = [
  {
    id: '1',
    patient_name: 'Marie Laurent',
    reason: 'Contrôle visuel',
    time: '09:15',
    status: 'en_consultation',
    practitioner: 'Dr Koffi',
    avatar_tone: 'primary',
  },
  {
    id: '2',
    patient_name: 'Jean Dupont',
    reason: 'Fond d\'œil',
    time: '09:45',
    status: 'en_attente',
    practitioner: 'Dr Koffi',
    avatar_tone: 'secondary',
  },
  {
    id: '3',
    patient_name: 'Sophie Atlan',
    reason: 'Renouvellement lunettes',
    time: '10:15',
    status: 'en_attente',
    practitioner: 'Dr Blanc',
    avatar_tone: 'surface',
  },
  {
    id: '4',
    patient_name: 'Claude Martin',
    reason: 'Suivi glaucome',
    time: '08:30',
    status: 'termine',
    practitioner: 'Dr Koffi',
    avatar_tone: 'muted',
  },
]

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
  { label: 'Myopie évolutive', percent: 35 },
  { label: 'Presbytie', percent: 28 },
  { label: 'Cataracte (Dépistage)', percent: 18 },
  { label: 'Glaucome (Suivi)', percent: 12 },
]
