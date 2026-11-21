import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  variant = 'default',
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === 'destructive'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader compact>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isDestructive ? 'bg-destructive/10' : 'bg-amber-500/10',
              )}
            >
              <AlertTriangle
                className={cn('h-5 w-5', isDestructive ? 'text-destructive' : 'text-amber-600 dark:text-amber-400')}
              />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1 leading-relaxed">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter compact>
          <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            className={cn(
              'rounded-lg font-semibold',
              !isDestructive &&
                'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-sm hover:from-amber-400 hover:to-orange-500',
            )}
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Memproses...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
