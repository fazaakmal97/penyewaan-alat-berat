import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '@/components/admin/PageHeader'
import { ReportFilterBar, getDefaultReportFilter, validateReportFilter } from '@/components/admin/ReportFilterBar'
import { ReportToolbar } from '@/components/admin/ReportToolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { reportService } from '@/services/reportService'
import { formatDate, formatRupiah } from '@/utils/format'
import {
  exportReportExcel,
  exportReportPdf,
  printReportArea,
  type ExportColumn,
} from '@/utils/reportExport'
import type { LaporanPenyewaanRow, ReportFilterParams, ReportMeta } from '@/types/report'

function penyewaanColumns(): ExportColumn<LaporanPenyewaanRow>[] {
  return [
    { header: 'Kode Sewa', accessor: (r) => r.kode },
    { header: 'Tgl Sewa', accessor: (r) => r.tanggal },
    { header: 'Customer', accessor: (r) => r.customer },
    { header: 'Jumlah Alat', accessor: (r) => r.jumlah_alat },
    { header: 'Total (Rp)', accessor: (r) => r.total_harga },
    { header: 'Status Sewa', accessor: (r) => r.status_label },
  ]
}

function ReportSummary({ meta }: { meta: ReportMeta }) {
  return (
    <div className="summary mb-4 space-y-3">
      <p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Menampilkan transaksi sewa berdasarkan tanggal pesanan (kecuali status Draft).
      </p>
      <div className="grid gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground">Periode</p>
          <p className="font-semibold">{meta.label}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(meta.from)} — {formatDate(meta.to)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Jumlah data</p>
          <p className="font-semibold">{meta.total_rows} baris</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total nilai sewa</p>
          <p className="font-semibold text-amber-600 dark:text-amber-400">
            {formatRupiah(meta.total_nilai)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function LaporanPage() {
  const [filter, setFilter] = useState<ReportFilterParams>(() => getDefaultReportFilter())
  const [appliedFilter, setAppliedFilter] = useState<ReportFilterParams>(() => getDefaultReportFilter())

  const query = useQuery({
    queryKey: ['laporan-penyewaan', appliedFilter],
    queryFn: () => reportService.penyewaan(appliedFilter),
  })

  const rows = query.data?.rows ?? []
  const meta = query.data?.meta
  const hasData = rows.length > 0

  const applyFilter = () => {
    const error = validateReportFilter(filter)
    if (error) {
      toast.error(error)
      return
    }
    setAppliedFilter({ ...filter })
  }

  const handlePrint = () => {
    if (!hasData) {
      toast.error('Tidak ada data untuk dicetak')
      return
    }
    printReportArea('report-print-area')
  }

  const handlePdf = () => {
    if (!meta || !hasData) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }
    const subtitle = `${meta.label} (${formatDate(meta.from)} — ${formatDate(meta.to)})`
    const footer = [
      `Total baris: ${meta.total_rows}`,
      `Total: ${formatRupiah(meta.total_nilai)}`,
    ]

    exportReportPdf(
      `laporan-penyewaan-${meta.from}`,
      'Laporan Penyewaan',
      subtitle,
      penyewaanColumns(),
      rows,
      footer,
    )
    toast.success('PDF berhasil diunduh')
  }

  const handleExcel = () => {
    if (!meta || !hasData) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }
    const summary: (string | number)[][] = [
      ['Laporan', 'Laporan Penyewaan'],
      ['Periode', meta.label],
      ['Dari', meta.from],
      ['Sampai', meta.to],
      ['Total Baris', meta.total_rows],
      ['Total Nilai', meta.total_nilai],
    ]

    exportReportExcel(
      `laporan-penyewaan-${meta.from}`,
      'Penyewaan',
      penyewaanColumns(),
      rows,
      summary,
    )
    toast.success('Excel berhasil diunduh')
  }

  return (
    <div>
      <PageHeader
        title="Laporan Penyewaan"
        description="Laporan transaksi sewa berdasarkan tanggal pesanan."
      />

      <div className="no-print mb-4 space-y-4">
        <ReportFilterBar
          value={filter}
          onChange={setFilter}
          onSubmit={applyFilter}
          loading={query.isFetching}
        />
        <ReportToolbar
          onPrint={handlePrint}
          onPdf={handlePdf}
          onExcel={handleExcel}
          disabled={!hasData || query.isLoading}
        />
      </div>

      <div id="report-print-area" className="rounded-xl border border-border/60 bg-card p-4 md:p-6">
        <div className="mb-4 border-b border-border/60 pb-3">
          <h3 className="text-lg font-bold">Laporan Penyewaan</h3>
          {meta && (
            <p className="text-sm text-muted-foreground">
              {meta.label} · {formatDate(meta.from)} — {formatDate(meta.to)}
            </p>
          )}
        </div>

        {query.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : query.isError ? (
          <p className="py-8 text-center text-sm text-destructive">Gagal memuat laporan.</p>
        ) : !meta ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Memuat data laporan...</p>
        ) : (
          <>
            <ReportSummary meta={meta} />

            {rows.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Tidak ada data pada periode ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-3 py-2 font-semibold">No</th>
                      <th className="px-3 py-2 font-semibold">Kode Sewa</th>
                      <th className="px-3 py-2 font-semibold">Tgl Sewa</th>
                      <th className="px-3 py-2 font-semibold">Customer</th>
                      <th className="px-3 py-2 text-center font-semibold">Alat</th>
                      <th className="px-3 py-2 font-semibold text-right">Total Sewa</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} className="border-b border-border/40">
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{row.kode}</td>
                        <td className="px-3 py-2">{formatDate(row.tanggal)}</td>
                        <td className="px-3 py-2">{row.customer}</td>
                        <td className="px-3 py-2 text-center">{row.jumlah_alat}</td>
                        <td className="px-3 py-2 text-right font-medium">
                          {formatRupiah(row.total_harga)}
                        </td>
                        <td className="px-3 py-2">{row.status_label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
