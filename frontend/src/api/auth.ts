import client from './client'
import type { AuthResponse, ApiResponse } from '../types'

export const authApi = {
  register: (data: { email: string; password: string; displayName: string }) =>
    client.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data.data),

  login: (data: { email: string; password: string }) =>
    client.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data.data),

  logout: () => client.post('/auth/logout'),

  refresh: () =>
    client.post<ApiResponse<{ accessToken: string }>>('/auth/refresh').then((r) => r.data.data),

  me: () =>
    client.get<ApiResponse<AuthResponse['user']>>('/auth/me').then((r) => r.data.data),
}
