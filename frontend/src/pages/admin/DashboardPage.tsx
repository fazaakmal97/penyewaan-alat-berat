import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { formatRupiah } from '@/utils/format'
import { Card, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PenyewaanChart } from '@/components/admin/charts/PenyewaanChart'
import { PendapatanChart } from '@/components/admin/charts/PendapatanChart'
import { AlatPopulerChart } from '@/components/admin/charts/AlatPopulerChart'
import { Users, Package, Truck, Wallet, Activity, CheckCircle2 } from 'lucide-react'

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard().then((r) => r.data.data),
  })

  const stats = data?.stats

  const cards = [
    { label: 'Total Customer', value: stats?.total_customer, icon: Users },
    { label: 'Total Penyewaan', value: stats?.total_penyewaan, icon: Package },
    { label: 'Total Alat Berat', value: stats?.total_alat_berat, icon: Truck },
    { label: 'Total Pendapatan', value: stats?.total_pendapatan, format: true, icon: Wallet },
    { label: 'Penyewaan Aktif', value: stats?.penyewaan_aktif, icon: Activity },
    { label: 'Penyewaan Selesai', value: stats?.penyewaan_selesai, icon: CheckCircle2 },
  ]

  return (
    <div>
      <div className="mb-8 hidden border-b border-border/60 pb-6 md:block">
        <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Ringkasan operasional penyewaan alat berat</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : cards.map((c) => (
              <Card key={c.label} className="group relative overflow-hidden border-border/60">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 transition group-hover:bg-amber-500/10" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                    <p className="mt-2 text-2xl font-bold tracking-tight">
                      {c.format ? formatRupiah(c.value ?? 0) : c.value ?? 0}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                    <c.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </Card>
            ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </>
        ) : (
          <>
            <PenyewaanChart data={data?.penyewaan_per_bulan ?? []} />
            <PendapatanChart data={data?.pendapatan_per_bulan ?? []} />
          </>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <AlatPopulerChart data={data?.alat_populer ?? []} />
        )}
      </div>
    </div>
  )
}
