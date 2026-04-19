import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { expenseApi } from '@/api/expense.api'
import type { ExpenseFilters } from '@/types'

export function useExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseApi.getAll(filters),
    staleTime: 30_000,
  })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: expenseApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      qc.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof expenseApi.update>[1] }) =>
      expenseApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      qc.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: expenseApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['analytics'] })
      qc.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
