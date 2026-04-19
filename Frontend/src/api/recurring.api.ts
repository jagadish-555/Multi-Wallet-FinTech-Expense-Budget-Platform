import api from './axios'
import type { RecurringExpense } from '@/types'

export const recurringApi = {
  getAll: () => api.get<unknown, RecurringExpense[]>('/recurring'),

  create: (data: {
    categoryId: string
    amount: number
    currency: string
    description: string
    scheduleType: RecurringExpense['scheduleType']
    scheduleDay?: number
    startDate: string
    endDate?: string
  }) => api.post<unknown, RecurringExpense>('/recurring', data),

  pause: (id: string) => api.patch<unknown, RecurringExpense>(`/recurring/${id}/pause`),

  resume: (id: string) => api.patch<unknown, RecurringExpense>(`/recurring/${id}/resume`),

  remove: (id: string) => api.delete<unknown, null>(`/recurring/${id}`),
}
