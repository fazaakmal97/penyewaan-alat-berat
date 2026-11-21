import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, children, invalid, ...props }, ref) => {
  return (
    <div className="relative w-full min-w-0">
      <select
        ref={ref}
        className={cn(
          'flex h-9 w-full min-w-0 appearance-none rounded-lg border border-border/80 bg-background py-1.5 pl-3 pr-9 text-sm text-foreground',
          'shadow-sm transition-[border-color,box-shadow] duration-200',
          'hover:border-amber-500/35',
          'focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && fieldInvalidClass,
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  )
})
Select.displayName = 'Select'
