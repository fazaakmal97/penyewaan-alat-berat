import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { compact?: boolean; invalid?: boolean }
>(({ className, compact, invalid, rows, ...props }, ref) => {
  return (
    <textarea
      rows={rows ?? (compact ? 2 : 3)}
      className={cn(
        'w-full min-w-0 resize-none rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-foreground',
        compact ? 'min-h-[58px]' : 'min-h-[88px]',
        'shadow-sm transition-[border-color,box-shadow] duration-200',
        'placeholder:text-muted-foreground/60',
        'hover:border-amber-500/35',
        'focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/15',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && fieldInvalidClass,
        className,
      )}
      ref={ref}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'
