import client from './client'
import type { User, ApiResponse } from '../types'

export const userApi = {
  getMe: () =>
    client.get<ApiResponse<User>>('/users/me').then((r) => r.data.data),

  update: (data: { displayName?: string; avatarUrl?: string; dailyGoalMins?: number }) =>
    client.patch<ApiResponse<User>>('/users/me', data).then((r) => r.data.data),

  delete: () => client.delete('/users/me'),
}
