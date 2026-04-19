import api from './axios'
import type { Category } from '@/types'

export const categoryApi = {
  getAll: () => api.get<unknown, Category[]>('/categories'),

  create: (data: { name: string; icon: string; colorHex: string; parentId?: string }) =>
    api.post<unknown, Category>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    api.put<unknown, Category>(`/categories/${id}`, data),

  remove: (id: string) => api.delete<unknown, null>(`/categories/${id}`),
}
