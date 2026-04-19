import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recurringApi } from '@/api/recurring.api'

export function useRecurring() {
  return useQuery({
    queryKey: ['recurring'],
    queryFn: recurringApi.getAll,
    staleTime: 30_000,
  })
}

export function useCreateRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recurringApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  })
}

export function usePauseRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recurringApi.pause,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  })
}

export function useResumeRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recurringApi.resume,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  })
}

export function useDeleteRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recurringApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
  })
}
