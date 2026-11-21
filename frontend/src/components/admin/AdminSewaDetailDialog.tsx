import { AlertTriangle, Check, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { AlatStatusBadge } from '@/components/customer/AlatStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'
import { useConfirm } from '@/hooks/useConfirm'
import { adminService } from '@/services/adminService'
import { SEWA_STATUS, type Sewa } from '@/types'
import { PEMBAYARAN_STATUS } from '@/types/dashboard'
import { formatDate, formatRupiah } from '@/utils/format'
import {
  detailNeedsRelease,
  isRentalExpired,
  rentalDaysRemaining,
  sewaNeedsAlatRelease,
} from '@/utils/sewaUtils'

const statusBadge = (status: number): 'default' | 'success' | 'destructive' | 'muted' => {
  if ([3, 4, 5].includes(status)) return 'success'
  if ([6, 7].includes(status)) return 'destructive'
  if (status === 0) return 'muted'
  return 'default'
}

interface AdminSewaDetailDialogProps {
  detail: Sewa | null
  onClose: () => void
  onRefresh: (sewa: Sewa) => void
  onApprove: (sewa: Sewa) => void
  onReject: (sewa: Sewa) => void
  onStatusChange: (sewaId: string, newStatus: number, currentLabel: string) => void
}

export function AdminSewaDetailDialog({
  detail,
  onClose,
  onRefresh,
  onApprove,
  onReject,
  onStatusChange,
}: AdminSewaDetailDialogProps) {
  const confirm = useConfirm()

  const releaseAlat = async (alatBeratId: number, alatNama: string) => {
    if (!detail) return
    await confirm({
      title: 'Kembalikan Alat Berat',
      description: `Set status "${alatNama}" menjadi Tersedia? Masa sewa alat ini sudah berakhir.`,
      confirmLabel: 'Set Tersedia',
      onConfirm: async () => {
        try {
          const res = await adminService.releaseAlat(detail.id, alatBeratId)
          toast.success('Alat berat dikembalikan ke status tersedia')
          onRefresh(res.data.data)
        } catch {
          toast.error('Gagal mengembalikan alat berat')
          throw new Error('release failed')
        }
      },
    })
  }

  const releaseAllExpired = async () => {
    if (!detail) return
    await confirm({
      title: 'Kembalikan Semua Alat',
      description:
        'Set semua alat berat yang masa sewanya sudah habis menjadi Tersedia? Status penyewaan akan otomatis diubah ke Selesai jika semua alat sudah dikembalikan.',
      confirmLabel: 'Kembalikan Semua',
      onConfirm: async () => {
        try {
          const res = await adminService.releaseAllExpiredAlat(detail.id)
          toast.success('Semua alat berat yang masa sewanya habis telah dikembalikan')
          onRefresh(res.data.data)
        } catch {
          toast.error('Gagal mengembalikan alat berat')
          throw new Error('release all failed')
        }
      },
    })
  }

  const needsRelease = detail ? sewaNeedsAlatRelease(detail) : false

  return (
    <Dialog open={!!detail} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-full sm:max-w-3xl">
        <DialogHeader compact>
          <div className="mb-1.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <DialogTitle className="break-all sm:break-normal">
            Detail Penyewaan — {detail?.kode}
          </DialogTitle>
        </DialogHeader>

        {detail && (
          <div className="flex min-h-0 flex-1 flex-col">
            <DialogBody scrollable className="space-y-4">
              {needsRelease && (
                <div className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      Masa sewa sudah berakhir
                    </p>
                    <p className="text-xs text-amber-800/90 dark:text-amber-200/90 sm:text-sm">
                      Satu atau lebih alat berat masih berstatus Disewa padahal tanggal sewa sudah
                      lewat. Kembalikan alat ke status Tersedia agar bisa disewa kembali.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-amber-500/50 bg-card hover:bg-amber-500/10"
                      onClick={releaseAllExpired}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Kembalikan Semua Alat
                    </Button>
                  </div>
                </div>
              )}

              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-lg border border-border/60 bg-muted/25 p-4 text-xs sm:grid-cols-2 sm:text-sm">
                <dt className="text-muted-foreground">Kode Pesanan</dt>
                <dd className="font-medium">{detail.kode}</dd>
                <dt className="text-muted-foreground">Tanggal Pesanan</dt>
                <dd>{formatDate(detail.tanggal)}</dd>
                <dt className="text-muted-foreground">Status Pesanan</dt>
                <dd>
                  <Badge variant={statusBadge(detail.status)}>
                    {SEWA_STATUS[detail.status] ?? detail.status}
                  </Badge>
                </dd>
                <dt className="text-muted-foreground">Customer</dt>
                <dd className="font-medium">{detail.customer?.nama ?? '-'}</dd>
                <dt className="text-muted-foreground">Email Customer</dt>
                <dd>{detail.customer?.email ?? '-'}</dd>
                <dt className="text-muted-foreground">No. HP Customer</dt>
                <dd>{detail.customer?.no_hp ?? '-'}</dd>
                <dt className="text-muted-foreground">PIC Penyewaan</dt>
                <dd>
                  {detail.nama_pic} ({detail.no_hp_pic})
                </dd>
                <dt className="text-muted-foreground">Alamat Pengiriman</dt>
                <dd className="sm:col-span-1">{detail.alamat_pengiriman}</dd>
                <dt className="text-muted-foreground">Total Tagihan</dt>
                <dd className="font-bold text-amber-600 dark:text-amber-400">
                  {formatRupiah(Number(detail.total_harga))}
                </dd>
                {detail.catatan && (
                  <>
                    <dt className="text-muted-foreground">Catatan</dt>
                    <dd className="sm:col-span-1">{detail.catatan}</dd>
                  </>
                )}
              </dl>

              <FormField compact label="Ubah Status Pesanan" htmlFor="sewa-status">
                <Select
                  id="sewa-status"
                  value={String(detail.status)}
                  onChange={(e) => {
                    const newStatus = Number(e.target.value)
                    if (newStatus === detail.status) return
                    onStatusChange(detail.id, newStatus, SEWA_STATUS[detail.status])
                  }}
                >
                  {Object.entries(SEWA_STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </FormField>

              <div>
                <h4 className="mb-3 text-sm font-semibold">Detail Alat Disewa</h4>
                <ul className="space-y-3">
                  {detail.detail_sewas?.map((d) => {
                    const expired = isRentalExpired(d.tgl_selesai)
                    const daysLeft = rentalDaysRemaining(d.tgl_selesai)
                    const showRelease = detailNeedsRelease(d)
                    const alat = d.alat_berat

                    return (
                      <li
                        key={d.id}
                        className="overflow-hidden rounded-xl border border-border/60 bg-card"
                      >
                        <div className="flex flex-col gap-3 p-4 sm:flex-row">
                          <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-28">
                            <img
                              src={alat?.foto_url ?? 'https://placehold.co/200x150/f1f5f9/64748b?text=Alat'}
                              alt={alat?.nama ?? 'Alat berat'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">{alat?.nama ?? '-'}</p>
                              {alat && <AlatStatusBadge status={alat.status} />}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Kode: {alat?.kode ?? '-'} ·{' '}
                              {[alat?.model?.merek?.nama, alat?.model?.nama]
                                .filter(Boolean)
                                .join(' · ') || '-'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Jenis:{' '}
                              {alat?.model?.jenis_alat?.nama ?? alat?.model?.jenisAlat?.nama ?? '-'}
                            </p>
                            <div className="grid gap-1 text-xs sm:grid-cols-2 sm:text-sm">
                              <p>
                                <span className="text-muted-foreground">Periode: </span>
                                {formatDate(d.tgl_mulai)} — {formatDate(d.tgl_selesai)}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Durasi: </span>
                                {d.jumlah_hari} hari
                              </p>
                              <p>
                                <span className="text-muted-foreground">Harga/hari: </span>
                                {formatRupiah(Number(d.harga_harian))}
                              </p>
                              <p className="font-medium text-amber-600 dark:text-amber-400">
                                Subtotal: {formatRupiah(Number(d.subtotal))}
                              </p>
                            </div>
                            {expired ? (
                              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                Masa sewa berakhir — alat perlu dikembalikan ke status Tersedia
                              </p>
                            ) : daysLeft === 0 ? (
                              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                Berakhir hari ini
                              </p>
                            ) : daysLeft > 0 ? (
                              <p className="text-xs text-muted-foreground">
                                Sisa masa sewa: {daysLeft} hari
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {showRelease && alat && (
                          <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                              onClick={() => releaseAlat(alat.id, alat.nama)}
                            >
                              <RotateCcw className="h-4 w-4" />
                              Set Tersedia
                            </Button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {detail.pembayarans && detail.pembayarans.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Riwayat Pembayaran</h4>
                  <ul className="space-y-2">
                    {detail.pembayarans.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{formatRupiah(Number(p.jumlah_bayar))}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(p.tgl_bayar)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={p.status === 1 ? 'success' : p.status === 2 ? 'destructive' : 'default'}>
                            {PEMBAYARAN_STATUS[p.status] ?? p.status}
                          </Badge>
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

            {detail.status === 2 && (
              <DialogFooter compact className="sm:[&_button]:flex-1">
                <Button className="rounded-lg" size="sm" variant="outline" onClick={() => onReject(detail)}>
                  <X className="h-4 w-4" />
                  Tolak Pesanan
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
                  onClick={() => onApprove(detail)}
                >
                  <Check className="h-4 w-4" />
                  {(detail.pembayarans?.length ?? 0) > 0 ? 'Setujui Pesanan' : 'Verifikasi Pesanan'}
                </Button>
              </DialogFooter>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
