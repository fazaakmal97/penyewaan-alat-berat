import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageFileField } from '@/components/ui/image-file-field'
import { FormField } from '@/components/ui/form-field'
import type { FormField as FormFieldConfig, SelectOption } from '@/features/master/types'
import { validateMasterForm } from '@/utils/validateMasterForm'
import { cn } from '@/utils/cn'
import { Loader2, Save } from 'lucide-react'

interface MasterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FormFieldConfig[]
  initialValues?: Record<string, unknown>
  loading?: boolean
  isEdit?: boolean
  onSubmit: (values: Record<string, unknown>) => void
}

function isFullWidthField(field: FormFieldConfig): boolean {
  return field.type === 'textarea' || field.type === 'file' || field.type === 'checkbox'
}

function fieldCellClass(field: FormFieldConfig): string {
  return cn('min-w-0 w-full', isFullWidthField(field) && 'sm:col-span-2')
}

export function MasterFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues = {},
  loading,
  isEdit,
  onSubmit,
}: MasterFormDialogProps) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [optionsMap, setOptionsMap] = useState<Record<string, SelectOption[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setValues({ is_active: true, ...initialValues })
      setErrors({})
    }
  }, [open, initialValues])

  useEffect(() => {
    if (!open) return
    fields.forEach(async (field) => {
      if (field.type === 'select' && typeof field.options === 'function') {
        const opts = await field.options()
        setOptionsMap((prev) => ({ ...prev, [field.name]: opts }))
      } else if (field.type === 'select' && Array.isArray(field.options)) {
        setOptionsMap((prev) => ({ ...prev, [field.name]: field.options as SelectOption[] }))
      }
    })
  }, [fields, open])

  const visibleFields = fields.filter((f) => {
    if (f.showOn === 'create' && isEdit) return false
    if (f.showOn === 'update' && !isEdit) return false
    return true
  })

  const patchValue = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const fieldError = (field: FormFieldConfig) => errors[field.name]

  const isFieldInvalid = (field: FormFieldConfig) => !!fieldError(field)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = { ...values }
    if (typeof normalized.kode === 'string') {
      normalized.kode = normalized.kode.trim()
    }
    const validationErrors = validateMasterForm(visibleFields, normalized, isEdit)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(normalized)
  }

  const renderFieldContent = (field: FormFieldConfig) => {
    const id = field.name
    const error = fieldError(field)
    const invalid = isFieldInvalid(field)
    const showRequired =
      field.required &&
      !(field.type === 'file' && isEdit && values[`${field.name}_url`])

    if (field.type === 'textarea') {
      return (
        <FormField label={field.label} htmlFor={id} required={showRequired} error={error} compact>
          <Textarea
            compact
            invalid={invalid}
            id={id}
            placeholder={field.placeholder}
            value={String(values[field.name] ?? '')}
            onChange={(e) => patchValue(field.name, e.target.value)}
          />
        </FormField>
      )
    }

    if (field.type === 'select') {
      return (
        <FormField label={field.label} htmlFor={id} required={showRequired} error={error} compact>
          <Select
            invalid={invalid}
            id={id}
            value={String(values[field.name] ?? '')}
            onChange={(e) => patchValue(field.name, e.target.value)}
          >
            <option value="">Pilih...</option>
            {(optionsMap[field.name] ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <Checkbox
          id={id}
          label={field.label || 'Status aktif'}
          checked={!!values[field.name]}
          onChange={(e) => patchValue(field.name, e.target.checked)}
        />
      )
    }

    if (field.type === 'file') {
      const urlKey = `${field.name}_url`
      const existingUrl = typeof values[urlKey] === 'string' ? values[urlKey] : undefined
      const fileValue = values[field.name] instanceof File ? values[field.name] : null

      return (
        <FormField label={field.label} htmlFor={id} required={showRequired} error={error} compact>
          <ImageFileField
            invalid={invalid}
            id={id}
            existingUrl={existingUrl}
            value={fileValue as File | null}
            onChange={(file) => patchValue(field.name, file)}
          />
        </FormField>
      )
    }

    const inputType =
      field.type === 'password'
        ? 'password'
        : field.type === 'number' || field.type === 'year'
          ? 'number'
          : field.type === 'email'
            ? 'email'
            : 'text'

    return (
      <FormField label={field.label} htmlFor={id} required={showRequired} error={error} compact>
        <Input
          invalid={invalid}
          id={id}
          type={inputType}
          placeholder={field.placeholder}
          value={
            values[field.name] !== undefined && values[field.name] !== null
              ? String(values[field.name])
              : ''
          }
          onChange={(e) =>
            patchValue(
              field.name,
              field.type === 'number' || field.type === 'year'
                ? e.target.value === ''
                  ? ''
                  : Number(e.target.value)
                : e.target.value,
            )
          }
        />
      </FormField>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex min-h-0 w-full flex-1 flex-col overflow-hidden" noValidate>
          <DialogHeader compact>
            <div className="mb-1.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description ?? (isEdit ? 'Perbarui data di bawah.' : 'Isi data baru di bawah.')}
            </DialogDescription>
          </DialogHeader>

          <DialogBody scrollable={false}>
            <div className="flex w-full min-w-0 flex-col gap-3.5 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3.5">
              {visibleFields.map((field) => (
                <div key={field.name} className={fieldCellClass(field)}>
                  {renderFieldContent(field)}
                </div>
              ))}
            </div>
          </DialogBody>

          <DialogFooter compact>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950 shadow-sm shadow-amber-500/15 hover:from-amber-400 hover:to-orange-500"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
