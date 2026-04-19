import api from './axios'
import type { User } from '@/types'

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; currency: string }) =>
    api.post<unknown, AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<unknown, AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<unknown, { accessToken: string }>('/auth/refresh', { refreshToken }),

  getMe: () => api.get<unknown, User>('/users/me'),

  updateMe: (data: Partial<{ name: string; currency: string; timezone: string }>) =>
    api.put<unknown, User>('/users/me', data),

  updatePreferences: (data: Record<string, unknown>) =>
    api.put<unknown, unknown>('/users/me/preferences', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<unknown, unknown>('/users/me/password', data),
}
