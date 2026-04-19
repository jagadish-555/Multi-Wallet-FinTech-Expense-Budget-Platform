import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/api/notification.api'

export function useNotifications(params?: { unread?: boolean }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.getAll(params),
    select: (payload) => payload.notifications,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
