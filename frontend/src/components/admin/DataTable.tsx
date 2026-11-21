import { ChevronLeft, ChevronRight, ArrowUpDown, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Paginated } from '@/types'
import type { TableColumn } from '@/features/master/types'

interface DataTableProps<T extends { id: number | string; deleted_at?: string | null }> {
  data?: Paginated<T>
  columns: TableColumn<T>[]
  loading?: boolean
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onPageChange?: (page: number) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onRestore?: (row: T) => void
  showTrash?: boolean
  renderActions?: (row: T) => React.ReactNode
  hideActions?: boolean
}

export function DataTable<T extends { id: number | string; deleted_at?: string | null }>({
  data,
  columns,
  loading,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  showTrash,
  renderActions,
  hideActions,
}: DataTableProps<T>) {
  const showActionColumn = !hideActions && (renderActions || onEdit || onDelete || onRestore)
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const rows = data?.data ?? []

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium">
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-primary"
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                      <ArrowUpDown className={`h-3 w-3 ${sortBy === col.key ? 'text-primary' : ''}`} />
                      {sortBy === col.key && <span className="text-xs">({sortDir})</span>}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {showActionColumn && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActionColumn ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isDeleted = !!row.deleted_at
                return (
                  <tr key={row.id} className={`border-t border-border ${isDeleted ? 'opacity-60' : ''}`}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '-')}
                      </td>
                    ))}
                    {showActionColumn && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {renderActions ? (
                            renderActions(row)
                          ) : isDeleted && onRestore ? (
                            <Button variant="ghost" size="icon" title="Pulihkan" onClick={() => onRestore(row)}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <>
                              {onEdit && (
                                <Button variant="ghost" size="icon" title="Edit" onClick={() => onEdit(row)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {onDelete && !showTrash && (
                                <Button variant="ghost" size="icon" title="Hapus" onClick={() => onDelete(row)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {data && data.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Halaman {data.current_page} dari {data.last_page} · Total {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={data.current_page <= 1}
              onClick={() => onPageChange?.(data.current_page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={data.current_page >= data.last_page}
              onClick={() => onPageChange?.(data.current_page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
