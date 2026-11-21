import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertTriangle, Check, Eye, X } from 'lucide-react'
import { AdminSewaDetailDialog } from '@/components/admin/AdminSewaDetailDialog'
import { adminService } from '@/services/adminService'
import { useConfirm } from '@/hooks/useConfirm'
import { SEWA_STATUS, type Paginated, type Sewa } from '@/types'
import { formatDate, formatRupiah } from '@/utils/format'
import { sewaNeedsAlatRelease } from '@/utils/sewaUtils'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import type { TableColumn } from '@/features/master/types'

const statusBadge = (status: number): 'default' | 'success' | 'destructive' | 'muted' => {
  if ([3, 4, 5].includes(status)) return 'success'
  if ([6, 7].includes(status)) return 'destructive'
  if (status === 0) return 'muted'
  return 'default'
}

export function SewaAdminPage() {
  const confirm = useConfirm()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [detail, setDetail] = useState<Sewa | null>(null)

  const params: Record<string, unknown> = { page, per_page: 15, sort_by: 'created_at', sort_dir: 'desc' }
  if (statusFilter !== '') params.status = statusFilter

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sewa', params],
    queryFn: () => adminService.sewa(params).then((r) => r.data.data),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-sewa'] })

  const columns: TableColumn<Sewa>[] = [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'customer', label: 'Customer', render: (r) => r.customer?.nama ?? '-' },
    { key: 'tanggal', label: 'Tanggal', render: (r) => formatDate(r.tanggal) },
    { key: 'total_harga', label: 'Total', render: (r) => formatRupiah(Number(r.total_harga)) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={statusBadge(r.status)}>{SEWA_STATUS[r.status] ?? r.status}</Badge>
          {sewaNeedsAlatRelease(r) && (
            <Badge variant="default" className="gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              Sewa habis
            </Badge>
          )}
        </div>
      ),
    },
  ]

  const openDetail = async (sewa: Sewa) => {
    try {
      const res = await adminService.sewaDetail(sewa.id)
      setDetail(res.data.data)
    } catch {
      setDetail(sewa)
    }
  }

  const requestApprove = async (sewa: Sewa) => {
    const hasPayment = (sewa.pembayarans?.length ?? 0) > 0
    await confirm({
      title: hasPayment ? 'Setujui Pesanan' : 'Verifikasi Pesanan',
      description: hasPayment
        ? `Setujui penyewaan ${sewa.kode} setelah pembayaran diverifikasi? Unit akan ditandai disewa.`
        : `Verifikasi pesanan ${sewa.kode}? Customer dapat melanjutkan ke pembayaran setelah diverifikasi.`,
      confirmLabel: hasPayment ? 'Setujui' : 'Verifikasi',
      onConfirm: async () => {
        try {
          await adminService.approveSewa(sewa.id)
          toast.success(hasPayment ? 'Pesanan disetujui' : 'Pesanan diverifikasi, customer dapat bayar')
          setDetail(null)
          invalidate()
          qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
        } catch {
          toast.error('Gagal menyetujui pesanan')
          throw new Error('approve failed')
        }
      },
    })
  }

  const requestReject = async (sewa: Sewa) => {
    await confirm({
      title: 'Tolak Pesanan',
      description: `Tolak penyewaan ${sewa.kode}? Alat berat dikembalikan ke status tersedia.`,
      confirmLabel: 'Tolak',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await adminService.rejectSewa(sewa.id)
          toast.success('Pesanan ditolak')
          setDetail(null)
          invalidate()
        } catch {
          toast.error('Gagal menolak pesanan')
          throw new Error('reject failed')
        }
      },
    })
  }

  const requestStatusChange = async (sewaId: string, newStatus: number, currentLabel: string) => {
    const newLabel = SEWA_STATUS[newStatus]
    await confirm({
      title: 'Ubah Status Penyewaan',
      description: `Ubah status dari "${currentLabel}" menjadi "${newLabel}"?`,
      confirmLabel: 'Ubah Status',
      onConfirm: async () => {
        try {
          await adminService.updateSewaStatus(sewaId, newStatus)
          toast.success('Status diperbarui')
          const res = await adminService.sewaDetail(sewaId)
          setDetail(res.data.data)
          invalidate()
          qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
        } catch {
          toast.error('Gagal memperbarui status')
          throw new Error('status failed')
        }
      },
    })
  }

  return (
    <div>
      <PageHeader title="Data Penyewaan" description="Kelola pesanan sewa alat berat" />

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
          {Object.entries(SEWA_STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      <DataTable
        data={data as Paginated<Sewa> | undefined}
        columns={columns}
        loading={isLoading}
        onPageChange={setPage}
        renderActions={(sewa) => (
          <>
            <Button size="sm" variant="outline" onClick={() => openDetail(sewa)}>
              <Eye className="h-4 w-4" />
            </Button>
            {sewa.status === 2 && (
              <>
                <Button size="sm" onClick={() => requestApprove(sewa)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => requestReject(sewa)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}
      />

      <AdminSewaDetailDialog
        detail={detail}
        onClose={() => setDetail(null)}
        onRefresh={(sewa) => {
          setDetail(sewa)
          invalidate()
          qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
        }}
        onApprove={requestApprove}
        onReject={requestReject}
        onStatusChange={requestStatusChange}
      />
    </div>
  )
}
