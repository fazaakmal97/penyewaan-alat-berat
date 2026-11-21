import { useEffect, useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { FileInput } from '@/components/ui/file-input'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'

interface ImageFileFieldProps {
  id: string
  label?: string
  existingUrl?: string | null
  value?: File | null
  onChange: (file: File | undefined) => void
  className?: string
  invalid?: boolean
}

export function ImageFileField({
  id,
  label,
  existingUrl,
  value,
  onChange,
  className,
  invalid,
}: ImageFileFieldProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null)

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
    setPreview(existingUrl ?? null)
  }, [value, existingUrl])

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-border/60 bg-muted/20',
          invalid && fieldInvalidClass,
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="Pratinjau foto"
            className="mx-auto max-h-36 w-full object-contain p-2 sm:max-h-40"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <ImageIcon className="h-8 w-8 opacity-40" />
            <span className="text-xs">Belum ada foto</span>
          </div>
        )}
      </div>
      <FileInput
        compact
        id={id}
        invalid={invalid}
        label={label ?? 'Pilih foto baru'}
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </div>
  )
}
