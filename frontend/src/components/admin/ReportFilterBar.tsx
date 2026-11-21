import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { ReportFilterParams, ReportPeriod } from '@/types/report'
import { todayLocalDate } from '@/utils/format'
import { Search } from 'lucide-react'

interface ReportFilterBarProps {
  value: ReportFilterParams
  onChange: (value: ReportFilterParams) => void
  onSubmit: () => void
  loading?: boolean
}

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  daily: 'Harian',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
}

const MONTH_OPTIONS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

function currentYear(): number {
  return new Date().getFullYear()
}

function currentMonth(): number {
  return new Date().getMonth() + 1
}

export function getDefaultReportFilter(): ReportFilterParams {
  const today = todayLocalDate()
  const year = currentYear()
  const month = currentMonth()

  return {
    period: 'daily',
    date_from: today,
    date_to: today,
    month_from: month,
    month_to: month,
    year,
    year_from: year,
    year_to: year,
  }
}

export function validateReportFilter(params: ReportFilterParams): string | null {
  if (params.period === 'daily') {
    if (!params.date_from || !params.date_to) {
      return 'Isi tanggal dari dan tanggal sampai'
    }
    if (params.date_from > params.date_to) {
      return 'Tanggal dari tidak boleh setelah tanggal sampai'
    }
  }

  if (params.period === 'monthly') {
    if (!params.year || !params.month_from || !params.month_to) {
      return 'Isi bulan dari, bulan sampai, dan tahun'
    }
    if (params.month_from > params.month_to) {
      return 'Bulan dari tidak boleh setelah bulan sampai'
    }
  }

  if (params.period === 'yearly') {
    if (!params.year_from || !params.year_to) {
      return 'Isi tahun dari dan tahun sampai'
    }
    if (params.year_from > params.year_to) {
      return 'Tahun dari tidak boleh setelah tahun sampai'
    }
  }

  return null
}

export function ReportFilterBar({ value, onChange, onSubmit, loading }: ReportFilterBarProps) {
  const today = todayLocalDate()
  const year = currentYear()
  const month = currentMonth()

  const setPeriod = (period: ReportPeriod) => {
    onChange({
      ...value,
      period,
      date_from: value.date_from ?? today,
      date_to: value.date_to ?? today,
      month_from: value.month_from ?? month,
      month_to: value.month_to ?? month,
      year: value.year ?? year,
      year_from: value.year_from ?? year,
      year_to: value.year_to ?? year,
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-card p-4">
      <div className="min-w-[140px] flex-1 sm:flex-none">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Periode</label>
        <Select
          value={value.period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
        >
          {(Object.keys(PERIOD_LABELS) as ReportPeriod[]).map((p) => (
            <option key={p} value={p}>
              {PERIOD_LABELS[p]}
            </option>
          ))}
        </Select>
      </div>

      {value.period === 'daily' && (
        <>
          <div className="min-w-[160px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tanggal dari</label>
            <Input
              type="date"
              value={value.date_from ?? today}
              onChange={(e) => onChange({ ...value, date_from: e.target.value })}
            />
          </div>
          <div className="min-w-[160px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tanggal sampai</label>
            <Input
              type="date"
              value={value.date_to ?? today}
              onChange={(e) => onChange({ ...value, date_to: e.target.value })}
            />
          </div>
        </>
      )}

      {value.period === 'monthly' && (
        <>
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Bulan dari</label>
            <Select
              value={String(value.month_from ?? month)}
              onChange={(e) => onChange({ ...value, month_from: Number(e.target.value) })}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Bulan sampai</label>
            <Select
              value={String(value.month_to ?? month)}
              onChange={(e) => onChange({ ...value, month_to: Number(e.target.value) })}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[120px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tahun</label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={value.year ?? year}
              onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {value.period === 'yearly' && (
        <>
          <div className="min-w-[120px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tahun dari</label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={value.year_from ?? year}
              onChange={(e) => onChange({ ...value, year_from: Number(e.target.value) })}
            />
          </div>
          <div className="min-w-[120px] flex-1 sm:flex-none">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tahun sampai</label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={value.year_to ?? year}
              onChange={(e) => onChange({ ...value, year_to: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
      >
        <Search className="h-4 w-4" />
        Tampilkan
      </Button>
    </div>
  )
}
