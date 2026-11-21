import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { isAlatTersedia } from '@/types'
import { formatRupiah } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/customer/EmptyState'
import { AlatStatusBadge } from '@/components/customer/AlatStatusBadge'

export function KeranjangPage() {
  const { items, removeItem, total } = useCartStore()
  const hasUnavailable = items.some((item) => !isAlatTersedia(item.alat.status))

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <h1 className="mb-8 text-3xl font-bold">Keranjang</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang masih kosong"
          description="Jelajahi katalog dan tambahkan alat berat yang Anda butuhkan."
          action={
            <Link to="/katalog">
              <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950">
                Mulai Belanja
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-2 text-3xl font-bold">Keranjang Penyewaan</h1>
      <p className="mb-8 text-muted-foreground">{items.length} item dalam keranjang</p>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.alat_berat_id}
              className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-28">
                <img
                  src={item.alat.foto_url ?? 'https://placehold.co/200x150'}
                  alt={item.alat.nama}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.alat.nama}</h3>
                  <AlatStatusBadge status={item.alat.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.tgl_mulai} — {item.tgl_selesai}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Package className="mr-1 inline h-3.5 w-3.5" />
                  {item.jumlah_hari} hari sewa
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {formatRupiah(item.subtotal)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeItem(item.alat_berat_id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Ringkasan Pesanan</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} item)</span>
                <span>{formatRupiah(total())}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600 dark:text-amber-400">{formatRupiah(total())}</span>
                </div>
              </div>
            </div>
            {hasUnavailable && (
              <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                Beberapa alat tidak tersedia. Hapus item tersebut sebelum checkout.
              </p>
            )}
            <Link to="/checkout" className="mt-6 block">
              <Button
                size="lg"
                className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-slate-950 hover:opacity-90"
                disabled={hasUnavailable}
              >
                Lanjut Checkout
              </Button>
            </Link>
            <Link to="/katalog" className="mt-3 block text-center text-sm text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400">
              Lanjut belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
