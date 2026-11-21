import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'

const inputStyles = cn(
  'flex h-9 w-full min-w-0 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm text-foreground',
  'shadow-sm transition-[border-color,box-shadow] duration-200',
  'placeholder:text-muted-foreground/60',
  'hover:border-amber-500/35',
  'focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/15',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium',
)

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, type, invalid, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputStyles, invalid && fieldInvalidClass, className)}
      ref={ref}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})
Input.displayName = 'Input'
