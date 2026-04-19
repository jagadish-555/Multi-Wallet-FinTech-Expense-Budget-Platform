import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics.api'

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.getSummary,
    staleTime: 30_000,
  })
}

export function useAnalyticsByCategory(params: { from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ['analytics', 'by-category', params],
    queryFn: () => analyticsApi.getByCategory(params),
    staleTime: 30_000,
  })
}

export function useMonthlyTrend(params: { months?: number } = {}) {
  return useQuery({
    queryKey: ['analytics', 'monthly-trend', params],
    queryFn: () => analyticsApi.getMonthlyTrend(params),
    staleTime: 30_000,
  })
}
