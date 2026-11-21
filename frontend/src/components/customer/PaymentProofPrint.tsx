import { BRAND_NAME } from '@/components/BrandLogo'
import type { Pembayaran, Sewa } from '@/types'
import { PEMBAYARAN_STATUS } from '@/types/dashboard'
import { formatDate, formatRupiah } from '@/utils/format'

interface PaymentProofPrintProps {
  sewa: Sewa
  pembayaran: Pembayaran
}

export function PaymentProofPrint({ sewa, pembayaran }: PaymentProofPrintProps) {
  return (
    <div
      id="payment-proof-print-area"
      className="payment-proof-print rounded-2xl border border-border/80 bg-white p-6 text-slate-900 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-lg font-bold text-slate-900">{BRAND_NAME}</p>
          <p className="mt-1 text-sm text-slate-600">Bukti Pembayaran Penyewaan Alat Berat</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold uppercase tracking-wide text-emerald-600">Bukti Bayar</p>
          <p className="mt-1 font-mono text-sm font-semibold">{sewa.kode}</p>
        </div>
      </div>

      <dl className="mt-6 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">Customer</dt>
          <dd className="font-medium">{sewa.customer?.nama ?? sewa.nama_pic}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">Tanggal Bayar</dt>
          <dd className="font-medium">{formatDate(pembayaran.tgl_bayar)}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">Jumlah Bayar</dt>
          <dd className="font-bold text-emerald-600">{formatRupiah(Number(pembayaran.jumlah_bayar))}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">Total Sewa</dt>
          <dd className="font-medium">{formatRupiah(Number(sewa.total_harga))}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">Status Pembayaran</dt>
          <dd className="font-medium">{PEMBAYARAN_STATUS[pembayaran.status] ?? '-'}</dd>
        </div>
        <div className="flex justify-between gap-2 sm:block">
          <dt className="text-slate-500">PIC / Pengiriman</dt>
          <dd>{sewa.nama_pic}</dd>
        </div>
      </dl>

      {pembayaran.bukti_url && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Lampiran Bukti Transfer
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
            <img
              src={pembayaran.bukti_url}
              alt="Bukti transfer"
              className="mx-auto max-h-[420px] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}

      <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
        Dokumen dicetak pada {formatDate(new Date().toISOString().slice(0, 10))} · {BRAND_NAME}
      </p>
    </div>
  )
}
