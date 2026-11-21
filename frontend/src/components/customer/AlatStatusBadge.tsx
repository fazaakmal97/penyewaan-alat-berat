import { ALAT_STATUS } from '@/types'
import { cn } from '@/utils/cn'

const STATUS_STYLES: Record<number, string> = {
  0: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  1: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  2: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

export function AlatStatusBadge({ status, className }: { status: number; className?: string }) {
  const label = ALAT_STATUS[status] ?? 'Tidak diketahui'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
        STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {label}
    </span>
  )
}
