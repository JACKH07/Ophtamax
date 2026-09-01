export interface DashboardSummary {
  consultations_today: number
  consultations_planned: number
  patients_waiting: number
  average_wait_minutes: number
  revenue_today: number
  revenue_status: string
  new_patients_week: number
  new_patients_trend_percent: number
}

export type WaitingStatus = 'en_consultation' | 'en_attente' | 'termine'
export type AvatarTone = 'primary' | 'secondary' | 'surface' | 'muted'

export interface WaitingQueueItem {
  id: string
  patient_name: string
  reason: string
  time: string
  status: WaitingStatus
  practitioner: string
  avatar_tone: AvatarTone
}

export interface UpcomingSlot {
  id: string
  start_time: string
  end_time: string
  title: string
  patient_name?: string
  variant?: 'primary' | 'secondary'
}

export interface TopDiagnostic {
  label: string
  percent: number
}
