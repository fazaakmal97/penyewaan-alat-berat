import { apiClient, type ApiResponse } from '@/api/client'
import type { Paginated, Sewa } from '@/types'

export const customerService = {
  checkout: (data: Record<string, unknown>) =>
    apiClient.post<ApiResponse<Sewa>>('/customer/sewa', data),
  riwayat: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Paginated<Sewa>>>('/customer/sewa', { params }),
  detailSewa: (id: string) => apiClient.get<ApiResponse<Sewa>>(`/customer/sewa/${id}`),
  uploadPembayaran: (sewaId: string, formData: FormData) =>
    apiClient.post(`/customer/sewa/${sewaId}/pembayaran`, formData),
}
