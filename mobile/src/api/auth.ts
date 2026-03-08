import client from './client'
import type { AuthResponse, ApiResponse } from '../types'

export const authApi = {
  register: async (data: { email: string; password: string; displayName: string }) => {
    const response = await client.post<ApiResponse<AuthResponse>>('/auth/register', data)
    const refreshToken = response.data.data.refreshToken ?? ''
    return { data: response.data.data, refreshToken }
  },

  login: async (data: { email: string; password: string }) => {
    const response = await client.post<ApiResponse<AuthResponse>>('/auth/login', data)
    const refreshToken = response.data.data.refreshToken ?? ''
    return { data: response.data.data, refreshToken }
  },

  logout: () => client.post('/auth/logout'),

  me: () =>
    client.get<ApiResponse<AuthResponse['user']>>('/auth/me').then((r) => r.data.data),
}
