import { cn } from '@/utils/cn'

interface ElevatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function ElevatedCard({ children, className, hover = true }: ElevatedCardProps) {
  return (
    <div
      className={cn(
        'card-shine rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-sm',
        'dark:border-amber-500/10 dark:bg-card/90 dark:shadow-none',
        hover && 'transition-all duration-300 hover:border-amber-500/25 hover:shadow-md dark:hover:border-amber-500/25 dark:hover:shadow-lg dark:hover:shadow-amber-500/5',
        className,
      )}
    >
      {children}
    </div>
  )
}
