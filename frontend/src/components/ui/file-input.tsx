import { forwardRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'

export const FileInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; compact?: boolean; invalid?: boolean }
>(({ className, label = 'Klik untuk unggah foto', id, compact, invalid, ...props }, ref) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/80',
        'bg-muted/15 px-3 py-3 text-center transition-[border-color,background-color] duration-200',
        compact && 'sm:flex-row sm:gap-3 sm:px-4 sm:py-3.5 sm:text-left',
        'hover:border-amber-500/45 hover:bg-amber-500/5',
        'has-[:focus-visible]:border-amber-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-500/15',
        invalid && fieldInvalidClass,
        className,
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
        <Upload className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="min-w-0">
        <span className="block text-xs font-medium text-foreground sm:text-sm">{label}</span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">PNG, JPG · maks. 5MB</span>
      </div>
      <input type="file" id={id} ref={ref} className="sr-only" aria-invalid={invalid || undefined} {...props} />
    </label>
  )
})
FileInput.displayName = 'FileInput'
