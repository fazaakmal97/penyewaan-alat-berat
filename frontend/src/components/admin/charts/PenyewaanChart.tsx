import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import type { BulanStat } from '@/types/dashboard'
import { fillMonthlyData } from '@/utils/chart'

export function PenyewaanChart({ data }: { data: BulanStat[] }) {
  const chartData = fillMonthlyData(data)

  return (
    <Card>
      <CardTitle className="mb-4">Penyewaan per Bulan</CardTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="total" name="Penyewaan" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
