import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

export const Checkbox = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ className, label, id, ...props }, ref) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5',
        'transition-[border-color,background-color] duration-200',
        'hover:border-amber-500/35 hover:bg-amber-500/5',
        'has-[:checked]:border-amber-500/45 has-[:checked]:bg-amber-500/8',
        className,
      )}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input type="checkbox" id={id} ref={ref} className="peer sr-only" {...props} />
        <span className="flex h-4 w-4 items-center justify-center rounded border-2 border-border bg-background transition-all peer-checked:border-amber-500 peer-checked:bg-amber-500 peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/25">
          <Check className="h-2.5 w-2.5 text-slate-950 opacity-0 transition-opacity" strokeWidth={3} />
        </span>
      </span>
      {label && (
        <span className="min-w-0 flex-1 text-xs font-medium leading-snug text-foreground sm:text-sm">{label}</span>
      )}
    </label>
  )
})
Checkbox.displayName = 'Checkbox'
