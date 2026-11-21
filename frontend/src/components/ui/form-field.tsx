import { cn } from '@/utils/cn'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
  compact,
}: FormFieldProps) {
  return (
    <div className={cn('w-full min-w-0', compact ? 'space-y-1' : 'space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-0.5 text-xs font-medium text-foreground sm:text-sm"
        >
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div className="w-full min-w-0">{children}</div>
      {error ? (
        <p className="text-[11px] font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
