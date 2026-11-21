import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Building2, ChevronRight, CreditCard, Printer, Upload } from 'lucide-react'
import { InvoicePrint } from '@/components/customer/InvoicePrint'
import { catalogService } from '@/services/catalogService'
import { customerService } from '@/services/customerService'
import { formatRupiah, todayLocalDate } from '@/utils/format'
import { printInvoiceArea } from '@/utils/invoicePrint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/utils/apiError'
import { SEWA_STATUS } from '@/types'

export function PembayaranPage() {
  const { sewaId } = useParams()
  const [file, setFile] = useState<File | null>(null)
  const [jumlah, setJumlah] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: banks, isLoading: loadingBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: () => catalogService.banks().then((r) => r.data.data),
  })

  const { data: sewa, isLoading: loadingSewa } = useQuery({
    queryKey: ['sewa', sewaId],
    queryFn: () => customerService.detailSewa(sewaId!).then((r) => r.data.data),
    enabled: !!sewaId,
  })

  const handlePrintInvoice = () => {
    if (!sewa) return
    printInvoiceArea()
  }

  const canPay = sewa?.status === 1
  const waitingOrderVerify = sewa?.status === 2 && !sewa.pembayarans?.length
  const waitingPaymentVerify = sewa?.status === 2 && (sewa.pembayarans?.length ?? 0) > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !sewaId || !canPay) return
    const formData = new FormData()
    formData.append('tgl_bayar', todayLocalDate())
    formData.append('jumlah_bayar', jumlah || String(sewa?.total_harga))
    formData.append('bukti', file)
    setLoading(true)
    try {
      await customerService.uploadPembayaran(sewaId, formData)
      toast.success('Bukti pembayaran terkirim, menunggu verifikasi admin')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Upload gagal'))
    } finally {
      setLoading(false)
    }
  }

  if (loadingSewa) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 rounded-2xl" />
      </div>
    )
  }

  if (!sewa) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p className="text-muted-foreground">Pesanan tidak ditemukan</p>
        <Link to="/riwayat" className="mt-4 inline-block text-amber-600 hover:underline">
          Kembali ke riwayat
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
      <nav className="no-print mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/riwayat" className="transition hover:text-amber-600 dark:hover:text-amber-400">
          Riwayat
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Pembayaran</span>
      </nav>

      <div className="no-print mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pembayaran</h1>
          <p className="mt-2 text-muted-foreground">
            Pesanan <span className="font-semibold text-foreground">{sewa.kode}</span> — Total{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {formatRupiah(Number(sewa.total_harga))}
            </span>
          </p>
        </div>
        <Button type="button" variant="outline" className="rounded-full" onClick={handlePrintInvoice}>
          <Printer className="h-4 w-4" />
          Cetak Invoice
        </Button>
      </div>

      <div className="mb-8">
        <InvoicePrint sewa={sewa} banks={banks} />
      </div>

      {waitingOrderVerify && (
        <div className="no-print mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-800 dark:text-blue-200">
          Pesanan Anda sedang <strong>menunggu verifikasi admin</strong>. Setelah disetujui, Anda dapat
          melakukan pembayaran dan mengunggah bukti transfer di halaman ini.
        </div>
      )}

      {waitingPaymentVerify && (
        <div className="no-print mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
          Bukti pembayaran sudah dikirim. Status: <strong>{SEWA_STATUS[sewa.status]}</strong>. Admin
          sedang memverifikasi pembayaran Anda.
        </div>
      )}

      {!canPay && !waitingOrderVerify && !waitingPaymentVerify && (
        <div className="no-print mb-6 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Pembayaran tidak tersedia untuk status pesanan: <strong>{SEWA_STATUS[sewa.status]}</strong>.
        </div>
      )}

      <div className="no-print space-y-6">
        {canPay && (
          <>
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold">Rekening Tujuan Transfer</h2>
          </div>
          {loadingBanks ? (
            <Skeleton className="h-24 rounded-xl" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {banks?.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-border bg-muted/30 p-4 transition hover:border-amber-500/40"
                >
                  <p className="font-semibold">{b.nama}</p>
                  <p className="mt-1 font-mono text-lg tracking-wide">{b.no_rek}</p>
                  <p className="mt-1 text-sm text-muted-foreground">a.n. {b.atas_nama}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold">Upload Bukti Transfer</h2>
          </div>
          <div className="space-y-4">
            <FormField label="Jumlah Bayar">
              <Input
                type="number"
                placeholder={String(sewa.total_harga)}
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />
            </FormField>
            <FormField label="Bukti Transfer" required>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 transition hover:border-amber-500/50 hover:bg-muted/50">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {file ? file.name : 'Klik untuk pilih gambar bukti transfer'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG maks. 5MB</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </label>
            </FormField>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-slate-950 hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
            </Button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  )
}
