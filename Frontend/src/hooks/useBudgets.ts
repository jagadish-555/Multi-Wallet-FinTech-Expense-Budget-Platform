import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { budgetApi } from '@/api/budget.api'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: budgetApi.getAll,
    staleTime: 30_000,
  })
}

export function useCreateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: budgetApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useUpdateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof budgetApi.update>[1] }) =>
      budgetApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useDeleteBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: budgetApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}
