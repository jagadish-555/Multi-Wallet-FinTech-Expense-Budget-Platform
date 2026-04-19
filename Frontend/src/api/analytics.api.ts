import api from './axios'
import type { AnalyticsSummary, MonthlyTrend } from '@/types'

interface BackendCategorySpending {
  categoryId: string
  category: {
    id: string
    name: string
    icon: string
    colorHex: string
  } | null
  total: number
}

function getDefaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)

  const format = (date: Date) => date.toISOString().slice(0, 10)

  return {
    from: format(from),
    to: format(to),
  }
}

export const analyticsApi = {
  getSummary: () => api.get<unknown, AnalyticsSummary>('/analytics/summary'),

  getByCategory: async (params: { from?: string; to?: string }) => {
    const defaults = getDefaultRange()
    const resolvedParams = {
      from: params.from ?? defaults.from,
      to: params.to ?? defaults.to,
    }

    const data = await api.get<unknown, BackendCategorySpending[]>('/analytics/by-category', {
      params: resolvedParams,
    })

    return data.map((row) => ({
      categoryId: row.categoryId,
      categoryName: row.category?.name ?? 'Uncategorized',
      color: row.category?.colorHex ?? '#9ca3af',
      total: Number(row.total ?? 0),
    }))
  },

  getMonthlyTrend: (params: { months?: number }) =>
    api.get<unknown, MonthlyTrend[]>('/analytics/monthly-trend', { params }),
}
