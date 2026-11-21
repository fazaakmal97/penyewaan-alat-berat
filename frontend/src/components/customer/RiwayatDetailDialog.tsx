import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Printer, Receipt } from 'lucide-react'
import { InvoicePrint } from '@/components/customer/InvoicePrint'
import { PaymentProofPrint } from '@/components/customer/PaymentProofPrint'
import { catalogService } from '@/services/catalogService'
import { customerService } from '@/services/customerService'
import { SEWA_STATUS, type Pembayaran } from '@/types'
import { PEMBAYARAN_STATUS } from '@/types/dashboard'
import { formatDate, formatRupiah } from '@/utils/format'
import { printInvoiceArea, printPaymentProofArea } from '@/utils/invoicePrint'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface RiwayatDetailDialogProps {
  sewaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function latestPaymentWithBukti(pembayarans?: Pembayaran[]): Pembayaran | undefined {
  if (!pembayarans?.length) return undefined
  return [...pembayarans].reverse().find((p) => p.bukti_url)
}

export function RiwayatDetailDialog({ sewaId, open, onOpenChange }: RiwayatDetailDialogProps) {
  const { data: sewa, isLoading } = useQuery({
    queryKey: ['sewa', sewaId],
    queryFn: () => customerService.detailSewa(sewaId!).then((r) => r.data.data),
    enabled: open && !!sewaId,
  })

  const { data: banks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => catalogService.banks().then((r) => r.data.data),
    enabled: open,
  })

  const paymentForPrint = latestPaymentWithBukti(sewa?.pembayarans)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-2xl">
          <DialogHeader compact>
            <DialogTitle className="break-all sm:break-normal">
              Detail Pesanan {sewa?.kode ?? ''}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <DialogBody scrollable className="space-y-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </DialogBody>
          ) : sewa ? (
            <>
              <DialogBody scrollable className="space-y-4">
                <dl className="grid grid-cols-1 gap-x-3 gap-y-1.5 rounded-lg border border-border/60 bg-muted/25 p-3 text-xs sm:grid-cols-2 sm:text-sm">
                  <dt className="text-muted-foreground">Kode Pesanan</dt>
                  <dd className="font-medium">{sewa.kode}</dd>
                  <dt className="text-muted-foreground">Tanggal</dt>
                  <dd>{formatDate(sewa.tanggal)}</dd>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>{SEWA_STATUS[sewa.status]}</dd>
                  <dt className="text-muted-foreground">PIC</dt>
                  <dd>
                    {sewa.nama_pic} ({sewa.no_hp_pic})
                  </dd>
                  <dt className="text-muted-foreground">Alamat Pengiriman</dt>
                  <dd>{sewa.alamat_pengiriman}</dd>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-bold text-amber-600 dark:text-amber-400">
                    {formatRupiah(Number(sewa.total_harga))}
                  </dd>
                  {sewa.catatan && (
                    <>
                      <dt className="text-muted-foreground">Catatan</dt>
                      <dd>{sewa.catatan}</dd>
                    </>
                  )}
                </dl>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Detail Alat</h4>
                  <ul className="space-y-2">
                    {sewa.detail_sewas?.map((d) => (
                      <li
                        key={d.id}
                        className="rounded-lg border border-border/60 bg-card p-3 text-sm"
                      >
                        <p className="font-medium">{d.alat_berat?.nama ?? '-'}</p>
                        <p className="mt-1 text-muted-foreground">
                          {formatDate(d.tgl_mulai)} — {formatDate(d.tgl_selesai)} · {d.jumlah_hari}{' '}
                          hari
                        </p>
                        <p className="mt-1 font-medium text-amber-600 dark:text-amber-400">
                          {formatRupiah(Number(d.subtotal))}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {sewa.pembayarans && sewa.pembayarans.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Riwayat Pembayaran</h4>
                    <ul className="space-y-2">
                      {sewa.pembayarans.map((p) => (
                        <li
                          key={p.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium">{formatRupiah(Number(p.jumlah_bayar))}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(p.tgl_bayar)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {PEMBAYARAN_STATUS[p.status]}
                            </span>
                            {p.bukti_url && (
                              <a
                                href={p.bukti_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400"
                              >
                                Lihat bukti
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </DialogBody>

              <DialogFooter compact className="flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg sm:w-auto"
                  onClick={() => printInvoiceArea()}
                >
                  <Printer className="h-4 w-4" />
                  Cetak Invoice
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg sm:w-auto"
                  disabled={!paymentForPrint}
                  onClick={() => printPaymentProofArea()}
                >
                  <Receipt className="h-4 w-4" />
                  Cetak Bukti Bayar
                </Button>
                {sewa.status === 1 && (
                  <Link to={`/pembayaran/${sewa.id}`} className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                    <Button
                      size="sm"
                      className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950 sm:w-auto"
                    >
                      Bayar Sekarang
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </DialogFooter>
            </>
          ) : (
            <DialogBody>
              <p className="text-sm text-muted-foreground">Data pesanan tidak ditemukan.</p>
            </DialogBody>
          )}
        </DialogContent>
      </Dialog>

      {sewa && (
        <div className="customer-print-host" aria-hidden>
          <InvoicePrint sewa={sewa} banks={banks} />
          {paymentForPrint && <PaymentProofPrint sewa={sewa} pembayaran={paymentForPrint} />}
        </div>
      )}
    </>
  )
}
