import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  variant?: 'default' | 'destructive'
  /** Jika diisi, dijalankan saat konfirmasi; return false untuk batalkan penutupan */
  onConfirm?: () => void | Promise<void>
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void
}

const ConfirmContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>
} | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null)
  const [loading, setLoading] = useState(false)

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve })
    })
  }, [])

  const handleClose = (open: boolean) => {
    if (!open && !loading) {
      state?.resolve(false)
      setState(null)
    }
  }

  const handleConfirm = async () => {
    if (!state) return
    setLoading(true)
    try {
      if (state.onConfirm) {
        await state.onConfirm()
      }
      state.resolve(true)
      setState(null)
    } catch {
      // error ditangani pemanggil (toast); dialog tetap terbuka
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={!!state}
        onOpenChange={handleClose}
        title={state?.title ?? ''}
        description={state?.description ?? ''}
        confirmLabel={state?.confirmLabel}
        variant={state?.variant}
        loading={loading}
        onConfirm={handleConfirm}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm harus digunakan di dalam ConfirmProvider')
  }
  return ctx.confirm
}
