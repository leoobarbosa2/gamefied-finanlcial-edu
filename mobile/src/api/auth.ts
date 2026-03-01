import client from './client'
import type { AuthResponse, ApiResponse } from '../types'

// Helper: parse refresh_token value from Set-Cookie header
function extractRefreshToken(setCookieHeader: string | string[] | undefined): string | null {
  if (!setCookieHeader) return null
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
  for (const header of headers) {
    const match = header.match(/refresh_token=([^;]+)/)
    if (match) return match[1]
  }
  return null
}

export const authApi = {
  register: async (data: { email: string; password: string; displayName: string }) => {
    const response = await client.post<ApiResponse<AuthResponse>>('/auth/register', data)
    const setCookie = response.headers['set-cookie']
    const refreshToken = extractRefreshToken(setCookie) ?? ''
    return { data: response.data.data, refreshToken }
  },

  login: async (data: { email: string; password: string }) => {
    const response = await client.post<ApiResponse<AuthResponse>>('/auth/login', data)
    const setCookie = response.headers['set-cookie']
    const refreshToken = extractRefreshToken(setCookie) ?? ''
    return { data: response.data.data, refreshToken }
  },

  logout: () => client.post('/auth/logout'),

  me: () =>
    client.get<ApiResponse<AuthResponse['user']>>('/auth/me').then((r) => r.data.data),
}
