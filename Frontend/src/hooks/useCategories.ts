import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/api/category.api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    staleTime: 30_000,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof categoryApi.update>[1] }) =>
      categoryApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
