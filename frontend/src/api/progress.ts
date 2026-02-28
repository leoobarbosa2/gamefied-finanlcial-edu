import client from './client'
import type { ProgressSummary, StreakData, UserMetrics, ApiResponse } from '../types'

export const progressApi = {
  getSummary: () =>
    client.get<ApiResponse<ProgressSummary>>('/progress').then((r) => r.data.data),

  getStreak: () =>
    client.get<ApiResponse<StreakData>>('/progress/streak').then((r) => r.data.data),

  getPathProgress: (pathId: string) =>
    client.get<ApiResponse<unknown>>(`/progress/paths/${pathId}`).then((r) => r.data.data),

  getMetrics: () =>
    client.get<ApiResponse<UserMetrics>>('/progress/metrics').then((r) => r.data.data),
}
