import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  onAdd?: () => void
  addLabel?: string
}

export function PageHeader({ title, description, onAdd, addLabel = 'Tambah Data' }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-6">
      <div>
        <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {onAdd && (
        <Button
          onClick={onAdd}
          className="shadow-md shadow-amber-500/15 bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950 hover:from-amber-400 hover:to-orange-500"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}
