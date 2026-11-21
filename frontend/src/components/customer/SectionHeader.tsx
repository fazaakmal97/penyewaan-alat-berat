import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  href?: string
  linkLabel?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  href,
  linkLabel = 'Lihat semua',
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-end justify-between gap-4',
        centered && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={cn(centered && 'flex flex-col items-center')}>
        {eyebrow && (
          <span className="mb-2 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            {eyebrow}
          </span>
        )}
        <div className={cn('flex items-center gap-3', centered && 'flex-col gap-2')}>
          {!centered && (
            <span className="hidden h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600/30 shadow-sm shadow-amber-500/20 sm:block" />
          )}
          <div className={cn(centered && 'section-accent flex flex-col items-center')}>
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl lg:text-[1.65rem]">
              <span className="bg-gradient-to-r from-foreground to-foreground bg-clip-text dark:from-white dark:to-amber-100/90">
                {title}
              </span>
            </h2>
            {subtitle && (
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {href && (
        <Link
          to={href}
          className="group inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/5 px-4 py-2 text-sm font-semibold text-amber-700 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 dark:text-amber-300"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
