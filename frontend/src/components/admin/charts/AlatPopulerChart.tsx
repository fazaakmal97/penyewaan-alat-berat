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
import type { AlatPopuler } from '@/types/dashboard'

export function AlatPopulerChart({ data }: { data: AlatPopuler[] }) {
  const chartData = data.map((item) => ({
    nama:
      item.alat_berat?.nama?.slice(0, 20) ??
      `Alat #${item.alat_berat_id}`,
    total: Number(item.total),
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardTitle className="mb-4">Alat Paling Sering Disewa</CardTitle>
        <p className="py-12 text-center text-sm text-muted-foreground">Belum ada data penyewaan</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle className="mb-4">Alat Paling Sering Disewa</CardTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="nama" width={120} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="total" name="Jumlah Sewa" fill="#ea580c" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
