import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  alt?: string
  title?: string
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  url,
  alt = 'Pratinjau foto',
  title,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-3xl">
        <DialogHeader compact className="border-b-0 pb-0">
          <DialogTitle className="text-base">{title ?? alt}</DialogTitle>
          <DialogDescription className="sr-only">Pratinjau gambar</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center px-4 pb-5 pt-1 sm:px-5 sm:pb-6">
          <img
            src={url}
            alt={alt}
            className="max-h-[min(70dvh,640px)] w-full rounded-xl border border-border/60 bg-muted/20 object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
