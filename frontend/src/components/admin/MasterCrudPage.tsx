import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, Trash2 } from 'lucide-react'
import { masterService } from '@/services/masterService'
import { useConfirm } from '@/hooks/useConfirm'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { MasterFormDialog } from '@/components/admin/MasterFormDialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { MasterConfig } from '@/features/master/types'
import type { Paginated } from '@/types'

interface MasterCrudPageProps<T extends { id: number | string; deleted_at?: string | null }> {
  config: MasterConfig<T>
}

export function MasterCrudPage<T extends { id: number | string; deleted_at?: string | null }>({
  config,
}: MasterCrudPageProps<T>) {
  const confirm = useConfirm()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [isActiveFilter, setIsActiveFilter] = useState<string>('')
  const [showTrash, setShowTrash] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const params: Record<string, unknown> = {
    page,
    per_page: 15,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...(search ? { search } : {}),
    ...(isActiveFilter !== '' ? { is_active: isActiveFilter === '1' } : {}),
    ...(showTrash ? { only_trashed: true } : {}),
  }

  const { data, isLoading } = useQuery({
    queryKey: [config.resource, params],
    queryFn: () => masterService.list<T>(config.resource, params).then((r) => r.data.data),
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: [config.resource] })

  const getRowLabel = (row: T) => {
    const r = row as Record<string, unknown>
    return String(r.nama ?? r.kode ?? r.username ?? config.title)
  }

  const requestDelete = async (row: T) => {
    await confirm({
      title: 'Hapus Data',
      description: `Hapus "${getRowLabel(row)}"? Data akan di-soft delete dan dapat dipulihkan dari menu Data Terhapus.`,
      confirmLabel: 'Hapus',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const id = config.getRowId ? config.getRowId(row) : row.id
          await masterService.remove(config.resource, id)
          toast.success('Data berhasil dihapus')
          invalidate()
        } catch {
          toast.error('Gagal menghapus data')
          throw new Error('delete failed')
        }
      },
    })
  }

  const requestRestore = async (row: T) => {
    await confirm({
      title: 'Pulihkan Data',
      description: `Pulihkan "${getRowLabel(row)}"?`,
      confirmLabel: 'Pulihkan',
      onConfirm: async () => {
        try {
          const id = config.getRowId ? config.getRowId(row) : row.id
          await masterService.restore(config.resource, id)
          toast.success('Data berhasil dipulihkan')
          invalidate()
        } catch {
          toast.error('Gagal memulihkan data')
          throw new Error('restore failed')
        }
      },
    })
  }

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (row: T) => {
    setEditing(row)
    setFormOpen(true)
  }

  const getInitialValues = useCallback((): Record<string, unknown> => {
    if (!editing) return { ...config.defaultValues, is_active: true }
    const row = editing as Record<string, unknown>
    const values: Record<string, unknown> = { ...row }
    ;['jenis_alat_id', 'merek_id', 'model_id', 'status'].forEach((key) => {
      if (row[key] !== undefined && row[key] !== null) {
        values[key] = String(row[key])
      }
    })
    return values
  }, [editing, config.defaultValues])

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true)
    try {
      const payload = config.toPayload ? config.toPayload(values, !!editing) : values

      if (editing) {
        const id = config.getRowId ? config.getRowId(editing) : editing.id
        await masterService.update(config.resource, id, payload)
        toast.success('Data berhasil diperbarui')
      } else {
        await masterService.create(config.resource, payload)
        toast.success('Data berhasil ditambahkan')
      }
      setFormOpen(false)
      invalidate()
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data
      const firstFieldError = res?.errors ? Object.values(res.errors).flat()[0] : undefined
      const msg = firstFieldError ?? res?.message
      toast.error(msg ?? 'Gagal menyimpan data')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={config.title} description={config.description} onAdd={showTrash ? undefined : openCreate} />

      <div className="mb-4 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-64 pl-9"
              placeholder="Cari..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            Cari
          </Button>
        </form>
        <Select
          className="w-36"
          value={isActiveFilter}
          onChange={(e) => {
            setIsActiveFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Semua Status</option>
          <option value="1">Aktif</option>
          <option value="0">Nonaktif</option>
        </Select>
        <Button
          variant={showTrash ? 'default' : 'outline'}
          onClick={() => {
            setShowTrash(!showTrash)
            setPage(1)
          }}
        >
          <Trash2 className="h-4 w-4" />
          {showTrash ? 'Data Aktif' : 'Data Terhapus'}
        </Button>
      </div>

      <DataTable
        data={data as Paginated<T> | undefined}
        columns={config.columns}
        loading={isLoading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        onPageChange={setPage}
        onEdit={showTrash ? undefined : openEdit}
        onDelete={showTrash ? undefined : requestDelete}
        onRestore={showTrash ? requestRestore : undefined}
        showTrash={showTrash}
      />

      <MasterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? `Edit ${config.title}` : `Tambah ${config.title}`}
        fields={config.formFields}
        initialValues={getInitialValues()}
        loading={submitting}
        isEdit={!!editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
