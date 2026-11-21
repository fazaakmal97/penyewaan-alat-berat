import type { BulanStat } from '@/types/dashboard'

const BULAN_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export function fillMonthlyData(data: BulanStat[], year = new Date().getFullYear()) {
  const map = new Map(data.map((d) => [Number(d.bulan), Number(d.total)]))

  return BULAN_LABELS.map((label, index) => ({
    bulan: index + 1,
    label: `${label} ${year}`,
    total: map.get(index + 1) ?? 0,
  }))
}
