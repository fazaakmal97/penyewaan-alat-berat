export type ReportPeriod = 'daily' | 'monthly' | 'yearly'

export interface ReportMeta {
  period: ReportPeriod
  report_type: 'penyewaan'
  label: string
  from: string
  to: string
  total_rows: number
  total_nilai: number
}

export interface ReportResponse<TRow> {
  meta: ReportMeta
  rows: TRow[]
}

export interface LaporanPenyewaanRow {
  id: string
  kode: string
  tanggal: string
  customer: string
  customer_kode: string
  total_harga: number
  status: number
  status_label: string
  jumlah_alat: number
}

export interface ReportFilterParams {
  period: ReportPeriod
  date_from?: string
  date_to?: string
  month_from?: number
  month_to?: number
  year?: number
  year_from?: number
  year_to?: number
}
