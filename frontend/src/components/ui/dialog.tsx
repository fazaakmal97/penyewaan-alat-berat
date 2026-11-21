import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[6px]" />
      <DialogPrimitive.Content
        className={cn(
          'dialog-content fixed inset-0 z-50 flex outline-none',
          'items-end justify-center',
          'sm:items-center sm:p-4',
        )}
        {...props}
      >
        <div
          className={cn(
            'dialog-panel relative flex w-full min-w-0 flex-col overflow-hidden bg-card',
            'max-h-[92dvh] rounded-t-2xl border border-b-0 border-border/60 shadow-[0_-8px_30px_rgba(15,23,42,0.12)]',
            'pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]',
            'sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-2xl sm:border sm:shadow-2xl sm:shadow-slate-900/15',
            'dark:sm:shadow-black/50',
            className,
          )}
        >
          <div
            className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/30 sm:hidden"
            aria-hidden
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>

          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg',
                'bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors duration-200',
                'hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30',
                'sm:right-3.5 sm:top-3.5 sm:bg-transparent sm:backdrop-blur-none',
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup</span>
            </DialogPrimitive.Close>
          )}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({
  className,
  compact,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }) {
  return (
    <div
      className={cn(
        'relative z-0 shrink-0 border-b border-border/60 bg-gradient-to-r from-amber-500/5 to-transparent',
        'pr-12 sm:pr-12',
        compact
          ? 'px-4 pb-2.5 pt-1 sm:px-5 sm:pb-3 sm:pt-4'
          : 'px-4 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-5',
        className,
      )}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'pr-1 text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg',
        className,
      )}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('mt-0.5 pr-1 text-xs leading-relaxed text-muted-foreground sm:text-sm', className)}
      {...props}
    />
  )
}

export function DialogBody({
  className,
  scrollable = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { scrollable?: boolean }) {
  return (
    <div
      className={cn(
        'relative z-0 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain',
        scrollable ? 'px-4 py-3 sm:px-6 sm:py-5' : 'px-4 py-3 sm:px-5 sm:py-3',
        className,
      )}
      {...props}
    />
  )
}

export function DialogFooter({
  className,
  compact,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }) {
  return (
    <div
      className={cn(
        'relative z-10 shrink-0 flex flex-col-reverse gap-2 border-t border-border/60 bg-card',
        'sm:flex-row sm:justify-end sm:gap-2.5',
        '[&_button]:w-full sm:[&_button]:w-auto',
        compact ? 'px-4 py-3 sm:px-5 sm:py-3' : 'gap-3 px-4 py-3 sm:px-6 sm:py-4',
        className,
      )}
      {...props}
    />
  )
}
