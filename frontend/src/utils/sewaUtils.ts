import type { DetailSewa, Sewa } from '@/types'

const ALAT_DISEWA = 1

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

function todayDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function isRentalExpired(tglSelesai: string): boolean {
  return parseLocalDate(tglSelesai) < todayDate()
}

export function rentalDaysRemaining(tglSelesai: string): number {
  const end = parseLocalDate(tglSelesai)
  const today = todayDate()
  return Math.round((end.getTime() - today.getTime()) / 86400000)
}

export function detailNeedsRelease(d: DetailSewa): boolean {
  return isRentalExpired(d.tgl_selesai) && d.alat_berat?.status === ALAT_DISEWA
}

export function sewaNeedsAlatRelease(sewa: Sewa): boolean {
  return sewa.detail_sewas?.some(detailNeedsRelease) ?? false
}
