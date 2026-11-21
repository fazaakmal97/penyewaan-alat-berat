import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { catalogService } from '@/services/catalogService'
import { AlatCard } from '@/components/AlatCard'
import { EmptyState } from '@/components/customer/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export function KatalogPage() {
  const [params, setParams] = useSearchParams()
  const filters = Object.fromEntries(params.entries())

  const { data: jenisList } = useQuery({
    queryKey: ['jenis-alat'],
    queryFn: () => catalogService.jenisAlat().then((r) => r.data.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['katalog', filters],
    queryFn: () => catalogService.list(filters).then((r) => r.data.data),
  })

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const clearFilters = () => setParams(new URLSearchParams())

  const hasFilters = Object.keys(filters).length > 0
  const total = data?.total ?? data?.data.length ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition hover:text-amber-600 dark:hover:text-amber-400">Beranda</Link>
        <span>/</span>
        <span className="font-medium text-foreground">Katalog</span>
      </nav>

      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 md:p-8 dark:border-amber-500/10 dark:to-amber-500/10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="relative">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Katalog
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Alat Berat Tersedia</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Temukan unit terbaik untuk proyek konstruksi, pertambangan, dan infrastruktur Anda.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filter — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Filter
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Cari</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nama alat..."
                    className="pl-9"
                    defaultValue={filters.search ?? ''}
                    onChange={(e) => updateParam('search', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {jenisList?.map((j) => {
                    const active = filters.jenis_alat_id === String(j.id)
                    return (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => updateParam('jenis_alat_id', active ? '' : String(j.id))}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium transition',
                          active
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                        )}
                      >
                        {j.nama}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Harga min</label>
                  <Input
                    type="number"
                    placeholder="0"
                    defaultValue={filters.harga_min ?? ''}
                    onChange={(e) => updateParam('harga_min', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Harga max</label>
                  <Input
                    type="number"
                    placeholder="∞"
                    defaultValue={filters.harga_max ?? ''}
                    onChange={(e) => updateParam('harga_max', e.target.value)}
                  />
                </div>
              </div>

              {hasFilters && (
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Reset Filter
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Mobile filter bar */}
          <div className="mb-6 flex flex-wrap gap-3 lg:hidden">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari alat..."
                className="pl-9"
                defaultValue={filters.search ?? ''}
                onChange={(e) => updateParam('search', e.target.value)}
              />
            </div>
            <Input
              type="number"
              placeholder="Harga min"
              className="max-w-[120px]"
              defaultValue={filters.harga_min ?? ''}
              onChange={(e) => updateParam('harga_min', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Harga max"
              className="max-w-[120px]"
              defaultValue={filters.harga_max ?? ''}
              onChange={(e) => updateParam('harga_max', e.target.value)}
            />
          </div>

          {/* Category pills mobile */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {jenisList?.map((j) => {
              const active = filters.jenis_alat_id === String(j.id)
              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => updateParam('jenis_alat_id', active ? '' : String(j.id))}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition',
                    active ? 'bg-amber-500 text-slate-950' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {j.nama}
                </button>
              )
            })}
          </div>

          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <Filter className="mr-1.5 inline h-4 w-4" />
              {isLoading ? 'Memuat...' : `${total} unit ditemukan`}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400 lg:hidden"
              >
                Reset filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Tidak ada alat ditemukan"
              description="Coba ubah kata kunci atau filter pencarian Anda."
              action={
                <Button onClick={clearFilters} className="rounded-full">
                  Lihat Semua Alat
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data?.data.map((alat) => <AlatCard key={alat.id} alat={alat} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
