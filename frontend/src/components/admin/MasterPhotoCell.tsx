import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import { ImagePreviewDialog } from '@/components/admin/ImagePreviewDialog'
import { cn } from '@/utils/cn'

interface MasterPhotoCellProps {
  url?: string | null
  alt?: string
  title?: string
}

export function MasterPhotoCell({ url, alt = 'Foto', title }: MasterPhotoCellProps) {
  const [previewOpen, setPreviewOpen] = useState(false)

  if (!url) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  const previewTitle = title ?? alt

  return (
    <>
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className={cn(
          'group relative inline-flex shrink-0 overflow-hidden rounded-lg border border-border/60',
          'ring-offset-background transition-all',
          'hover:border-amber-500/50 hover:ring-2 hover:ring-amber-500/25',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40',
        )}
        title="Klik untuk perbesar"
        aria-label={`Lihat foto ${previewTitle}`}
      >
        <img src={url} alt={alt} className="h-9 w-9 object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-colors group-hover:bg-slate-950/35">
          <ZoomIn className="h-3.5 w-3.5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </button>

      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        url={url}
        alt={alt}
        title={previewTitle}
      />
    </>
  )
}
