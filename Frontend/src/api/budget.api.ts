import api from './axios'
import type { Budget, BudgetWithUsage } from '@/types'

export const budgetApi = {
  getAll: () => api.get<unknown, BudgetWithUsage[]>('/budgets'),

  create: (data: {
    categoryId?: string
    limitAmount: number
    currency: string
    period: Budget['period']
    periodDay: number
    startDate: string
  }) => api.post<unknown, Budget>('/budgets', data),

  update: (id: string, data: Partial<Budget>) =>
    api.put<unknown, Budget>(`/budgets/${id}`, data),

  remove: (id: string) => api.delete<unknown, null>(`/budgets/${id}`),
}
