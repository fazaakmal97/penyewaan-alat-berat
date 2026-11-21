import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, ClipboardList, Eye } from 'lucide-react'
import { RiwayatDetailDialog } from '@/components/customer/RiwayatDetailDialog'
import { customerService } from '@/services/customerService'
import { SEWA_STATUS } from '@/types'
import { formatDate, formatRupiah } from '@/utils/format'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/customer/EmptyState'
import { cn } from '@/utils/cn'

const STATUS_STYLE: Record<number, string> = {
  0: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
  1: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  2: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  3: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  4: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  5: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
  6: 'bg-red-500/15 text-red-700 dark:text-red-300',
  7: 'bg-red-500/15 text-red-700 dark:text-red-300',
}

export function RiwayatPage() {
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['riwayat-sewa'],
    queryFn: () => customerService.riwayat().then((r) => r.data.data),
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-2 text-3xl font-bold">Riwayat Penyewaan</h1>
      <p className="mb-8 text-muted-foreground">Pantau status pesanan dan pembayaran Anda</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada riwayat sewa"
          description="Pesan alat berat dari katalog untuk melihat riwayat di sini."
          action={
            <Link to="/katalog">
              <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950">
                Lihat Katalog
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.data.map((sewa) => (
            <div
              key={sewa.id}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition hover:border-amber-500/30 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-foreground">{sewa.kode}</p>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        STATUS_STYLE[sewa.status] ?? STATUS_STYLE[0],
                      )}
                    >
                      {SEWA_STATUS[sewa.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(sewa.tanggal)}</p>
                  <p className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">
                    {formatRupiah(Number(sewa.total_harga))}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setDetailId(sewa.id)}
                  >
                    <Eye className="h-4 w-4" />
                    Detail
                  </Button>
                  {sewa.status === 1 && (
                    <Link to={`/pembayaran/${sewa.id}`}>
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
                      >
                        Bayar
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              {sewa.detail_sewas && sewa.detail_sewas.length > 0 && (
                <ul className="border-t border-border bg-muted/30 px-5 py-3 text-sm">
                  {sewa.detail_sewas.map((d) => (
                    <li key={d.id} className="flex justify-between py-1 text-muted-foreground">
                      <span>{d.alat_berat?.nama}</span>
                      <span>{d.jumlah_hari} hari</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <RiwayatDetailDialog
        sewaId={detailId}
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
      />
    </div>
  )
}
