import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'
import { AlatStatusBadge } from '@/components/customer/AlatStatusBadge'
import type { AlatBerat } from '@/types'
import { formatRupiah } from '@/utils/format'
import { cn } from '@/utils/cn'

export function AlatCard({ alat, className }: { alat: AlatBerat; className?: string }) {
  const merek = alat.model?.merek?.nama
  const model = alat.model?.nama

  return (
    <Link to={`/alat/${alat.id}`} className={cn('group block', className)}>
      <article className="group/card overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-500/35 hover:shadow-xl hover:shadow-amber-500/8 dark:border-amber-500/10 dark:bg-card/95 dark:shadow-none dark:hover:border-amber-500/30 dark:hover:shadow-2xl dark:hover:shadow-amber-500/10">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={alat.foto_url ?? 'https://placehold.co/400x300/f1f5f9/64748b?text=Alat+Berat'}
            alt={alat.nama}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm backdrop-blur">
            {alat.model?.jenis_alat?.nama ?? alat.model?.jenisAlat?.nama ?? 'Alat Berat'}
          </span>
          <AlatStatusBadge status={alat.status} className="absolute right-3 top-3 shadow-sm backdrop-blur" />
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition-all duration-300 translate-y-1 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            Lihat detail
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>

        <div className="space-y-2 p-4">
          {(merek || model) && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {[merek, model].filter(Boolean).join(' · ')}
            </p>
          )}
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
            {alat.nama}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Tahun {alat.tahun}
            </span>
          </div>
          <div className="flex items-end justify-between border-t border-border/50 pt-3">
            <div className="rounded-xl bg-amber-500/5 px-2.5 py-1.5 dark:bg-amber-500/10">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mulai dari</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatRupiah(Number(alat.harga_sewa_harian))}
                <span className="text-xs font-medium text-muted-foreground">/hari</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
