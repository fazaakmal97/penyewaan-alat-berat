import { apiClient, type ApiResponse } from '@/api/client'
import type { AlatBerat, Bank, JenisAlat, Paginated } from '@/types'

export const catalogService = {
  jenisAlat: () => apiClient.get<ApiResponse<JenisAlat[]>>('/public/jenis-alat'),
  list: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Paginated<AlatBerat>>>('/public/alat-berat', { params }),
  detail: (id: number) => apiClient.get<ApiResponse<AlatBerat>>(`/public/alat-berat/${id}`),
  terbaru: () => apiClient.get<ApiResponse<AlatBerat[]>>('/public/alat-berat/terbaru'),
  populer: () => apiClient.get<ApiResponse<AlatBerat[]>>('/public/alat-berat/populer'),
  banks: () => apiClient.get<ApiResponse<Bank[]>>('/public/banks'),
}
