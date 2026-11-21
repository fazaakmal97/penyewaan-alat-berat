import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Calendar, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import { catalogService } from '@/services/catalogService'
import { useCartStore } from '@/stores/cartStore'
import { isAlatTersedia } from '@/types'
import { formatRupiah } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AlatStatusBadge } from '@/components/customer/AlatStatusBadge'
import { cn } from '@/utils/cn'

export function DetailAlatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [tglMulai, setTglMulai] = useState('')
  const [tglSelesai, setTglSelesai] = useState('')

  const { data: alat, isLoading } = useQuery({
    queryKey: ['alat', id],
    queryFn: () => catalogService.detail(Number(id)).then((r) => r.data.data),
    enabled: !!id,
  })

  const hitungHari = () => {
    if (!tglMulai || !tglSelesai) return 0
    const start = new Date(tglMulai)
    const end = new Date(tglSelesai)
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1)
  }

  const subtotal = alat ? hitungHari() * Number(alat.harga_sewa_harian) : 0

  const handleAdd = () => {
    if (!alat || !tglMulai || !tglSelesai) {
      toast.error('Lengkapi tanggal sewa')
      return
    }
    if (!isAlatTersedia(alat.status)) {
      toast.error('Alat ini tidak tersedia untuk disewa')
      return
    }
    const added = addItem(alat, tglMulai, tglSelesai)
    if (!added) {
      toast.error('Alat ini tidak tersedia untuk disewa')
      return
    }
    toast.success('Ditambahkan ke keranjang')
    navigate('/keranjang')
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!alat) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
        <p className="text-muted-foreground">Alat tidak ditemukan</p>
        <Link to="/katalog">
          <Button className="mt-4 rounded-full">Kembali ke Katalog</Button>
        </Link>
      </div>
    )
  }

  const specs = [
    { label: 'Merek', value: alat.model?.merek?.nama },
    { label: 'Model', value: alat.model?.nama },
    { label: 'Jenis', value: alat.model?.jenis_alat?.nama ?? alat.model?.jenisAlat?.nama },
    { label: 'Kapasitas', value: alat.model?.kapasitas },
    { label: 'Daya Mesin', value: alat.model?.daya_mesin },
    { label: 'Berat Operasional', value: alat.model?.berat_operasional },
    { label: 'Tahun', value: alat.tahun },
    { label: 'Kode Unit', value: alat.kode },
  ]

  const tersedia = isAlatTersedia(alat.status)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition hover:text-amber-600 dark:hover:text-amber-400">Beranda</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/katalog" className="transition hover:text-amber-600 dark:hover:text-amber-400">Katalog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground line-clamp-1">{alat.nama}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        {/* Image */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-sm">
            <img
              src={alat.foto_url ?? 'https://placehold.co/800x600/f1f5f9/64748b?text=Alat+Berat'}
              alt={alat.nama}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {/* Specs */}
          <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Spesifikasi Teknis</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {specs.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value ?? '-'}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Order panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="mb-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
              <span className="ml-1 text-xs font-medium text-muted-foreground">Unit premium</span>
            </div>

            <h1 className="text-2xl font-bold leading-tight">{alat.nama}</h1>
            <div className="mt-2 flex items-center gap-2">
              <AlatStatusBadge status={alat.status} className="text-xs" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {[alat.model?.merek?.nama, alat.model?.nama].filter(Boolean).join(' · ')}
            </p>

            <div className="mt-5 rounded-xl bg-amber-500/10 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Harga sewa</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {formatRupiah(Number(alat.harga_sewa_harian))}
                <span className="text-base font-normal text-muted-foreground"> /hari</span>
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Tanggal Mulai
                </label>
                <Input
                  type="date"
                  value={tglMulai}
                  onChange={(e) => setTglMulai(e.target.value)}
                  disabled={!tersedia}
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Tanggal Selesai
                </label>
                <Input
                  type="date"
                  value={tglSelesai}
                  onChange={(e) => setTglSelesai(e.target.value)}
                  disabled={!tersedia}
                />
              </div>
            </div>

            {!tersedia && (
              <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                Alat ini sedang {alat.status === 1 ? 'disewa' : 'maintenance'} dan belum bisa ditambahkan ke keranjang.
              </p>
            )}

            {hitungHari() > 0 && (
              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{hitungHari()} hari × {formatRupiah(Number(alat.harga_sewa_harian))}</span>
                </div>
                <div className="mt-2 flex justify-between text-base font-bold">
                  <span>Subtotal</span>
                  <span className="text-amber-600 dark:text-amber-400">{formatRupiah(subtotal)}</span>
                </div>
              </div>
            )}

            <Button
              className={cn(
                'mt-6 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 py-6 text-base font-bold text-slate-950 shadow-md hover:opacity-90',
              )}
              size="lg"
              onClick={handleAdd}
              disabled={!tersedia}
            >
              <ShoppingCart className="h-5 w-5" />
              {tersedia ? 'Tambah ke Keranjang' : 'Tidak Tersedia'}
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Harga belum termasuk biaya operasional & pengiriman
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
