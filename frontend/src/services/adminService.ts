import { apiClient, type ApiResponse } from '@/api/client'
import type { DashboardData } from '@/types/dashboard'
import type { Paginated, Pembayaran, Sewa } from '@/types'

export const adminService = {
  dashboard: () => apiClient.get<ApiResponse<DashboardData>>('/admin/dashboard'),

  sewa: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Paginated<Sewa>>>('/admin/sewa', { params }),

  sewaDetail: (id: string) => apiClient.get<ApiResponse<Sewa>>(`/admin/sewa/${id}`),

  updateSewaStatus: (id: string, status: number) =>
    apiClient.patch(`/admin/sewa/${id}/status`, { status }),

  approveSewa: (id: string) => apiClient.post(`/admin/sewa/${id}/approve`),

  rejectSewa: (id: string) => apiClient.post(`/admin/sewa/${id}/reject`),

  releaseAlat: (sewaId: string, alatBeratId: number) =>
    apiClient.post(`/admin/sewa/${sewaId}/release-alat`, { alat_berat_id: alatBeratId }),

  releaseAllExpiredAlat: (sewaId: string) =>
    apiClient.post(`/admin/sewa/${sewaId}/release-all-expired`),

  pembayaran: (params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<Paginated<Pembayaran>>>('/admin/pembayaran', { params }),

  verifyPembayaran: (id: string) => apiClient.post(`/admin/pembayaran/${id}/verify`),

  rejectPembayaran: (id: string) => apiClient.post(`/admin/pembayaran/${id}/reject`),
}
