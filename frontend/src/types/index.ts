export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface User {
  id: number
  nama: string
  username: string
  is_active: boolean
  deleted_at?: string | null
}

export interface Customer {
  id: number
  kode: string
  nama: string
  email: string
  no_hp: string
  alamat?: string
  pic?: string
  is_active: boolean
  deleted_at?: string | null
}

export interface JenisAlat {
  id: number
  kode: string
  nama: string
  keterangan?: string
  is_active?: boolean
  deleted_at?: string | null
}

export interface Merek {
  id: number
  kode: string
  nama: string
  keterangan?: string
  is_active?: boolean
  deleted_at?: string | null
}

export interface ModelAlat {
  id: number
  kode: string
  nama: string
  jenis_alat_id?: number
  merek_id?: number
  kapasitas?: string
  daya_mesin?: string
  berat_operasional?: string
  keterangan?: string
  is_active?: boolean
  deleted_at?: string | null
  jenis_alat?: JenisAlat
  jenisAlat?: JenisAlat
  merek?: Merek
}

export interface AlatBerat {
  id: number
  kode: string
  nama: string
  model_id?: number
  tahun: number
  harga_sewa_harian: number
  status: number
  foto_name?: string
  foto_url?: string
  is_active?: boolean
  deleted_at?: string | null
  model?: ModelAlat
}

export interface DetailSewa {
  id: string
  alat_berat_id: number
  harga_harian: number
  tgl_mulai: string
  tgl_selesai: string
  jumlah_hari: number
  subtotal: number
  alat_berat?: AlatBerat
}

export interface Sewa {
  id: string
  kode: string
  tanggal: string
  total_harga: number
  status: number
  nama_pic: string
  no_hp_pic: string
  alamat_pengiriman: string
  catatan?: string
  detail_sewas?: DetailSewa[]
  pembayarans?: Pembayaran[]
  customer?: Customer
}

export interface Pembayaran {
  id: string
  sewa_id?: string
  tgl_bayar: string
  jumlah_bayar: number
  bukti_name?: string
  bukti_url?: string
  status: number
  sewa?: Sewa
}

export interface Bank {
  id: number
  nama: string
  no_rek: string
  atas_nama: string
  foto_name?: string
  foto_url?: string
  is_active?: boolean
  deleted_at?: string | null
}

export interface CartItem {
  alat_berat_id: number
  alat: AlatBerat
  tgl_mulai: string
  tgl_selesai: string
  jumlah_hari: number
  subtotal: number
}

export const ALAT_STATUS: Record<number, string> = {
  0: 'Tersedia',
  1: 'Disewa',
  2: 'Maintenance',
}

export const ALAT_STATUS_TERSEDIA = 0

export function isAlatTersedia(status: number): boolean {
  return status === ALAT_STATUS_TERSEDIA
}

export const SEWA_STATUS: Record<number, string> = {
  0: 'Draft',
  1: 'Menunggu Pembayaran',
  2: 'Menunggu Verifikasi',
  3: 'Disetujui',
  4: 'Sedang Berjalan',
  5: 'Selesai',
  6: 'Ditolak',
  7: 'Dibatalkan',
}
