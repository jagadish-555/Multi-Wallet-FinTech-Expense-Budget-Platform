import api from './axios'
import type { Expense, PaginationMeta, ExpenseFilters } from '@/types'

interface ExpensesResponse {
  expenses: Expense[]
  meta: PaginationMeta
}

export const expenseApi = {
  getAll: (filters: ExpenseFilters = {}) =>
    api.get<unknown, ExpensesResponse>('/expenses', { params: filters }),

  create: (data: {
    amount: number
    currency: string
    description: string
    categoryId: string
    expenseDate: string
  }) => api.post<unknown, Expense>('/expenses', data),

  update: (id: string, data: Partial<Expense>) =>
    api.put<unknown, Expense>(`/expenses/${id}`, data),

  remove: (id: string) => api.delete<unknown, null>(`/expenses/${id}`),

  exportCsv: (params: { from?: string; to?: string; categoryId?: string }) =>
    api.get<unknown, Blob>('/expenses/export', { params, responseType: 'blob' }),
}
