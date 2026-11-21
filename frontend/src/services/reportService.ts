import { apiClient, type ApiResponse } from '@/api/client'
import { todayLocalDate } from '@/utils/format'
import type {
  LaporanPenyewaanRow,
  ReportFilterParams,
  ReportResponse,
} from '@/types/report'

function toQuery(params: ReportFilterParams): Record<string, string | number> {
  const q: Record<string, string | number> = { period: params.period }

  if (params.period === 'daily') {
    q.date_from = params.date_from ?? todayLocalDate()
    q.date_to = params.date_to ?? params.date_from ?? todayLocalDate()
  }

  if (params.period === 'monthly') {
    q.year = params.year ?? new Date().getFullYear()
    q.month_from = params.month_from ?? new Date().getMonth() + 1
    q.month_to = params.month_to ?? params.month_from ?? new Date().getMonth() + 1
  }

  if (params.period === 'yearly') {
    const year = new Date().getFullYear()
    q.year_from = params.year_from ?? year
    q.year_to = params.year_to ?? params.year_from ?? year
  }

  return q
}

export const reportService = {
  penyewaan: (params: ReportFilterParams) =>
    apiClient
      .get<ApiResponse<ReportResponse<LaporanPenyewaanRow>>>('/admin/laporan/penyewaan', {
        params: toQuery(params),
      })
      .then((r) => r.data.data),
}
