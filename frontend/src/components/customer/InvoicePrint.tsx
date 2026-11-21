import { BRAND_NAME } from '@/components/BrandLogo'
import type { Bank, Sewa } from '@/types'
import { SEWA_STATUS } from '@/types'
import { formatDate, formatRupiah } from '@/utils/format'

interface InvoicePrintProps {
  sewa: Sewa
  banks?: Bank[]
}

export function InvoicePrint({ sewa, banks = [] }: InvoicePrintProps) {
  const customer = sewa.customer
  const details = sewa.detail_sewas ?? []

  return (
    <div id="invoice-print-area" className="invoice-print rounded-2xl border border-border/80 bg-white p-6 text-slate-900 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-lg font-bold text-slate-900">{BRAND_NAME}</p>
          <p className="mt-1 text-sm text-slate-600">Penyewaan Alat Berat</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold uppercase tracking-wide text-amber-600">Invoice</p>
          <p className="mt-1 font-mono text-sm font-semibold">{sewa.kode}</p>
          <p className="mt-1 text-sm text-slate-600">Tgl. {formatDate(sewa.tanggal)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tagihan Kepada</p>
          <p className="mt-2 font-semibold">{customer?.nama ?? sewa.nama_pic}</p>
          {customer?.email && <p className="text-sm text-slate-600">{customer.email}</p>}
          {customer?.no_hp && <p className="text-sm text-slate-600">{customer.no_hp}</p>}
          {customer?.alamat && <p className="mt-1 text-sm text-slate-600">{customer.alamat}</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pengiriman / PIC</p>
          <p className="mt-2 font-semibold">{sewa.nama_pic}</p>
          <p className="text-sm text-slate-600">{sewa.no_hp_pic}</p>
          <p className="mt-1 text-sm text-slate-600">{sewa.alamat_pengiriman}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="px-3 py-2 font-semibold">No</th>
              <th className="px-3 py-2 font-semibold">Alat Berat</th>
              <th className="px-3 py-2 font-semibold">Periode Sewa</th>
              <th className="px-3 py-2 text-center font-semibold">Hari</th>
              <th className="px-3 py-2 text-right font-semibold">Harga/Hari</th>
              <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, i) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-medium">{item.alat_berat?.nama ?? '-'}</p>
                  <p className="text-xs text-slate-500">
                    {[item.alat_berat?.model?.merek?.nama, item.alat_berat?.model?.nama]
                      .filter(Boolean)
                      .join(' · ') || item.alat_berat?.kode}
                  </p>
                </td>
                <td className="px-3 py-2 text-slate-600">
                  {formatDate(item.tgl_mulai)} — {formatDate(item.tgl_selesai)}
                </td>
                <td className="px-3 py-2 text-center">{item.jumlah_hari}</td>
                <td className="px-3 py-2 text-right">{formatRupiah(Number(item.harga_harian))}</td>
                <td className="px-3 py-2 text-right font-medium">{formatRupiah(Number(item.subtotal))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="px-3 py-3 text-right font-semibold">
                Total Tagihan
              </td>
              <td className="px-3 py-3 text-right text-lg font-bold text-amber-600">
                {formatRupiah(Number(sewa.total_harga))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {banks.length > 0 && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rekening Pembayaran</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {banks.map((b) => (
              <div key={b.id} className="text-sm">
                <span className="font-semibold">{b.nama}</span>
                <span className="mx-1 text-slate-400">·</span>
                <span className="font-mono">{b.no_rek}</span>
                <span className="text-slate-600"> a.n. {b.atas_nama}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-4 text-sm">
        <div>
          <p>
            <span className="text-slate-500">Status:</span>{' '}
            <span className="font-semibold">{SEWA_STATUS[sewa.status] ?? '-'}</span>
          </p>
          {sewa.catatan && (
            <p className="mt-1 text-slate-600">
              <span className="text-slate-500">Catatan:</span> {sewa.catatan}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-500">Dicetak pada {formatDate(new Date().toISOString().slice(0, 10))}</p>
      </div>
    </div>
  )
}
