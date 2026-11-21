import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import type { BulanStat } from '@/types/dashboard'
import { fillMonthlyData } from '@/utils/chart'
import { formatRupiah } from '@/utils/format'

export function PendapatanChart({ data }: { data: BulanStat[] }) {
  const chartData = fillMonthlyData(data)

  return (
    <Card>
      <CardTitle className="mb-4">Pendapatan per Bulan</CardTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
            />
            <Tooltip
              formatter={(value) => formatRupiah(Number(value))}
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Pendapatan"
              stroke="#f59e0b"
              fill="#f59e0b33"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
