import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImagePreviewDialog } from '@/components/admin/ImagePreviewDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PEMBAYARAN_STATUS } from '@/types/dashboard'
import { formatDate, formatRupiah } from '@/utils/format'
import type { Pembayaran } from '@/types'
import { AlertTriangle, Check, ExternalLink, ZoomIn, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface BuktiPembayaranDialogProps {
  pembayaran: Pembayaran | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: () => void
  onReject: () => void
}

export function BuktiPembayaranDialog({
  pembayaran,
  open,
  onOpenChange,
  onVerify,
  onReject,
}: BuktiPembayaranDialogProps) {
  const [buktiPreviewOpen, setBuktiPreviewOpen] = useState(false)
  const [buktiError, setBuktiError] = useState(false)

  useEffect(() => {
    setBuktiError(false)
  }, [pembayaran?.id, open])

  if (!pembayaran) return null

  const totalSewa = Number(pembayaran.sewa?.total_harga ?? 0)
  const jumlahBayar = Number(pembayaran.jumlah_bayar)
  const selisih = jumlahBayar - totalSewa
  const cocok = totalSewa > 0 && jumlahBayar >= totalSewa

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader compact>
          <div className="mb-1.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <DialogTitle>Verifikasi Bukti Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
        <DialogBody scrollable={false} className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{PEMBAYARAN_STATUS[pembayaran.status]}</Badge>
            <span className="text-xs font-medium text-muted-foreground">{pembayaran.sewa?.kode}</span>
          </div>

          <dl className="grid grid-cols-1 gap-x-3 gap-y-1.5 rounded-lg border border-border/60 bg-muted/25 p-3 text-xs sm:grid-cols-2 sm:text-sm">
            <dt className="text-muted-foreground">Customer</dt>
            <dd className="font-medium">{pembayaran.sewa?.customer?.nama}</dd>
            <dt className="text-muted-foreground">Tanggal</dt>
            <dd>{formatDate(pembayaran.tgl_bayar)}</dd>
            <dt className="text-muted-foreground">Total Sewa</dt>
            <dd className="font-semibold">{formatRupiah(totalSewa)}</dd>
            <dt className="text-muted-foreground">Transfer</dt>
            <dd className="font-semibold text-amber-600 dark:text-amber-400">{formatRupiah(jumlahBayar)}</dd>
          </dl>

          {!cocok && totalSewa > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/35 bg-amber-500/8 px-3 py-2 text-xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p>
                Selisih {formatRupiah(Math.abs(selisih))} — periksa bukti sebelum verifikasi.
              </p>
            </div>
          )}

          {pembayaran.bukti_url ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Bukti Transfer</p>
                {!buktiError && (
                  <a
                    href={pembayaran.bukti_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                  >
                    Buka
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {buktiError ? (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/8 px-3 py-3 text-xs text-red-700 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    File bukti tidak ditemukan di server. Minta customer mengunggah ulang bukti
                    pembayaran.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setBuktiPreviewOpen(true)}
                  className={cn(
                    'group relative flex w-full justify-center rounded-lg border border-border/60 bg-muted/15 p-2',
                    'transition-all hover:border-amber-500/45 hover:ring-2 hover:ring-amber-500/20',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40',
                  )}
                  title="Klik untuk perbesar"
                >
                  <img
                    src={pembayaran.bukti_url}
                    alt="Bukti transfer"
                    className="max-h-[min(40dvh,180px)] max-w-full rounded-md object-contain sm:max-h-[220px]"
                    onError={() => setBuktiError(true)}
                  />
                  <span className="absolute inset-2 flex items-center justify-center rounded-md bg-slate-950/0 transition-colors group-hover:bg-slate-950/25">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </button>
              )}
              <ImagePreviewDialog
                open={buktiPreviewOpen}
                onOpenChange={setBuktiPreviewOpen}
                url={pembayaran.bukti_url}
                alt="Bukti transfer"
                title={`Bukti transfer — ${pembayaran.sewa?.kode ?? 'Pembayaran'}`}
              />
            </div>
          ) : (
            <p className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
              Bukti tidak tersedia
            </p>
          )}
        </DialogBody>

        {pembayaran.status === 0 && (
          <DialogFooter compact>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={onReject}>
              <X className="h-3.5 w-3.5" />
              Tolak
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
              onClick={onVerify}
            >
              <Check className="h-3.5 w-3.5" />
              Verifikasi
            </Button>
          </DialogFooter>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
