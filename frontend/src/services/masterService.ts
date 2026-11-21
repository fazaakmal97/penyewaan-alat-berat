import { apiClient, type ApiResponse } from '@/api/client'
import type { Paginated } from '@/types'

export type MasterResource =
  | 'customers'
  | 'jenis-alat'
  | 'merek'
  | 'model'
  | 'alat-berat'
  | 'bank'
  | 'users'

export const masterService = {
  list: <T>(resource: MasterResource, params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Paginated<T>>>(`/admin/${resource}`, { params }),

  get: <T>(resource: MasterResource, id: number | string) =>
    apiClient.get<ApiResponse<T>>(`/admin/${resource}/${id}`),

  create: (resource: MasterResource, data: Record<string, unknown> | FormData) =>
    apiClient.post(`/admin/${resource}`, data),

  update: (resource: MasterResource, id: number | string, data: Record<string, unknown> | FormData) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return apiClient.post(`/admin/${resource}/${id}`, data)
    }
    return apiClient.put(`/admin/${resource}/${id}`, data)
  },

  remove: (resource: MasterResource, id: number | string) =>
    apiClient.delete(`/admin/${resource}/${id}`),

  restore: (resource: MasterResource, id: number | string) =>
    apiClient.post(`/admin/${resource}/${id}/restore`),
}
