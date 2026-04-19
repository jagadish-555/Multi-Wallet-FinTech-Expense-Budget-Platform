import api from './axios'
import type { Notification } from '@/types'

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

export const notificationApi = {
  getAll: (params?: { unread?: boolean }) =>
    api.get<unknown, NotificationsResponse>('/notifications', { params }),

  markRead: (id: string) =>
    api.patch<unknown, Notification>(`/notifications/${id}/read`),

  markAllRead: () => api.patch<unknown, null>('/notifications/read-all'),
}
