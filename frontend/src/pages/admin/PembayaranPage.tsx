import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Eye, Check, X, Clock } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { PEMBAYARAN_STATUS } from '@/types/dashboard'
import { formatDate, formatRupiah } from '@/utils/format'
import { useConfirm } from '@/hooks/useConfirm'
import { PageHeader } from '@/components/admin/PageHeader'
import { BuktiPembayaranDialog } from '@/components/admin/BuktiPembayaranDialog'
import { DataTable } from '@/components/admin/DataTable'
import { MasterPhotoCell } from '@/components/admin/MasterPhotoCell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import type { Pembayaran, Paginated } from '@/types'
import type { TableColumn } from '@/features/master/types'

const statusVariant = (status: number): 'default' | 'success' | 'destructive' => {
  if (status === 1) return 'success'
  if (status === 2) return 'destructive'
  return 'default'
}

export function PembayaranAdminPage() {
  const confirm = useConfirm()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('0')
  const [preview, setPreview] = useState<Pembayaran | null>(null)

  const params: Record<string, unknown> = { page, per_page: 15 }
  if (statusFilter !== '') params.status = statusFilter

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pembayaran', params],
    queryFn: () => adminService.pembayaran(params).then((r) => r.data.data),
  })

  const { data: pendingCount } = useQuery({
    queryKey: ['admin-pembayaran-pending-count'],
    queryFn: () =>
      adminService.pembayaran({ status: 0, per_page: 1 }).then((r) => r.data.data.total),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-pembayaran'] })
    qc.invalidateQueries({ queryKey: ['admin-pembayaran-pending-count'] })
    qc.invalidateQueries({ queryKey: ['admin-sewa'] })
    qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
  }

  const columns: TableColumn<Pembayaran>[] = [
    {
      key: 'bukti_url',
      label: 'Bukti',
      render: (r) => (
        <MasterPhotoCell
          url={r.bukti_url}
          alt="Bukti transfer"
          title={`Bukti transfer — ${r.sewa?.kode ?? 'Pembayaran'}`}
        />
      ),
    },
    { key: 'sewa', label: 'Kode Sewa', render: (r) => r.sewa?.kode ?? '-' },
    { key: 'customer', label: 'Customer', render: (r) => r.sewa?.customer?.nama ?? '-' },
    { key: 'tgl_bayar', label: 'Tgl Bayar', render: (r) => formatDate(r.tgl_bayar) },
    { key: 'jumlah_bayar', label: 'Jumlah', render: (r) => formatRupiah(Number(r.jumlah_bayar)) },
    {
      key: 'total_sewa',
      label: 'Total Sewa',
      render: (r) => formatRupiah(Number(r.sewa?.total_harga ?? 0)),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge variant={statusVariant(r.status)}>{PEMBAYARAN_STATUS[r.status] ?? r.status}</Badge>
      ),
    },
  ]

  const runVerify = async (p: Pembayaran) => {
    await confirm({
      title: 'Verifikasi Pembayaran',
      description: `Konfirmasi bukti transfer ${formatRupiah(Number(p.jumlah_bayar))} untuk sewa ${p.sewa?.kode}?`,
      confirmLabel: 'Verifikasi',
      onConfirm: async () => {
        try {
          await adminService.verifyPembayaran(p.id)
          toast.success('Pembayaran diverifikasi')
          setPreview(null)
          invalidate()
        } catch {
          toast.error('Gagal memverifikasi pembayaran')
          throw new Error('verify failed')
        }
      },
    })
  }

  const runReject = async (p: Pembayaran) => {
    await confirm({
      title: 'Tolak Pembayaran',
      description: `Tolak pembayaran sewa ${p.sewa?.kode}? Customer harus mengunggah bukti baru.`,
      confirmLabel: 'Tolak',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await adminService.rejectPembayaran(p.id)
          toast.success('Pembayaran ditolak')
          setPreview(null)
          invalidate()
        } catch {
          toast.error('Gagal menolak pembayaran')
          throw new Error('reject failed')
        }
      },
    })
  }

  return (
    <div>
      <PageHeader
        title="Verifikasi Pembayaran"
        description="Tinjau bukti transfer dan verifikasi pembayaran customer"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
            <Clock className="h-4 w-4" />
            Menunggu Verifikasi
          </CardTitle>
          <p className="mt-2 text-2xl font-bold text-amber-600">{pendingCount ?? 0}</p>
        </Card>
      </div>

      <div className="mb-4">
        <Select
          className="w-56"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Semua Status</option>
          <option value="0">Menunggu Verifikasi</option>
          <option value="1">Diverifikasi</option>
          <option value="2">Ditolak</option>
        </Select>
      </div>

      <DataTable
        data={data as Paginated<Pembayaran> | undefined}
        columns={columns}
        loading={isLoading}
        onPageChange={setPage}
        renderActions={(p) => (
          <>
            <Button
              size="sm"
              variant="outline"
              title="Lihat & verifikasi bukti"
              onClick={() => setPreview(p)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {p.status === 0 && (
              <>
                <Button size="sm" title="Verifikasi" onClick={() => runVerify(p)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" title="Tolak" onClick={() => runReject(p)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}
      />

      <BuktiPembayaranDialog
        pembayaran={preview}
        open={!!preview}
        onOpenChange={(o) => !o && setPreview(null)}
        onVerify={() => preview && runVerify(preview)}
        onReject={() => preview && runReject(preview)}
      />
    </div>
  )
}
