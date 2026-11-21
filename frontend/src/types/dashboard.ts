export interface DashboardStats {
  total_customer: number
  total_penyewaan: number
  total_alat_berat: number
  total_pendapatan: number
  penyewaan_aktif: number
  penyewaan_selesai: number
}

export interface BulanStat {
  bulan: number
  tahun: number
  total: number | string
}

export interface AlatPopuler {
  alat_berat_id: number
  total: number
  alat_berat?: {
    id: number
    nama: string
    kode: string
    model?: { nama: string; merek?: { nama: string } }
  }
}

export interface DashboardData {
  stats: DashboardStats
  penyewaan_per_bulan: BulanStat[]
  pendapatan_per_bulan: BulanStat[]
  alat_populer: AlatPopuler[]
}

export const PEMBAYARAN_STATUS: Record<number, string> = {
  0: 'Menunggu Verifikasi',
  1: 'Diverifikasi',
  2: 'Ditolak',
}
