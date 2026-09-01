import { apiClient } from '@/api/client'
import { ENDPOINTS, USE_MOCK } from '@/api/endpoints'
import {
  mockDashboardSummary,
  mockTopDiagnostics,
  mockUpcomingSlots,
  mockWaitingQueue,
} from '@/api/mock/dashboardMock'
import type { ApiResponse } from '@/api/types/auth'
import type {
  DashboardSummary,
  TopDiagnostic,
  UpcomingSlot,
  WaitingQueueItem,
} from '@/api/types/dashboard'

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK) return mockDashboardSummary

  const { data } = await apiClient.get<ApiResponse<DashboardSummary>>(ENDPOINTS.dashboard.summary)
  return data.data
}

export async function fetchWaitingQueue(date?: string): Promise<WaitingQueueItem[]> {
  if (USE_MOCK) return mockWaitingQueue

  const { data } = await apiClient.get<ApiResponse<WaitingQueueItem[]>>(
    ENDPOINTS.dashboard.waitingQueue,
    { params: { date } },
  )
  return data.data
}

export async function fetchUpcomingSlots(date?: string): Promise<UpcomingSlot[]> {
  if (USE_MOCK) return mockUpcomingSlots

  const { data } = await apiClient.get<ApiResponse<UpcomingSlot[]>>(
    ENDPOINTS.dashboard.upcomingSlots,
    { params: { date } },
  )
  return data.data
}

export async function fetchTopDiagnostics(): Promise<TopDiagnostic[]> {
  if (USE_MOCK) return mockTopDiagnostics

  const { data } = await apiClient.get<ApiResponse<TopDiagnostic[]>>(
    ENDPOINTS.dashboard.topDiagnostics,
  )
  return data.data
}
