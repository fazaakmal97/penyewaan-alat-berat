import type { FormField } from '@/features/master/types'

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'number') return Number.isNaN(value)
  return false
}

export function validateMasterField(
  field: FormField,
  values: Record<string, unknown>,
  isEdit?: boolean,
): string | null {
  if (field.showOn === 'create' && isEdit) return null
  if (field.showOn === 'update' && !isEdit) return null
  if (!field.required) return null

  if (field.type === 'checkbox') return null

  const value = values[field.name]

  if (field.type === 'file') {
    if (value instanceof File) return null
    const existingUrl = values[`${field.name}_url`]
    if (typeof existingUrl === 'string' && existingUrl.trim() !== '') return null
    return `${field.label} wajib diunggah`
  }

  if (field.type === 'select') {
    if (isEmpty(value) || value === '') return `${field.label} wajib dipilih`
    return null
  }

  if (field.type === 'number' || field.type === 'year') {
    if (isEmpty(value)) return `${field.label} wajib diisi`
    return null
  }

  if (field.type === 'password' && isEdit && field.showOn === 'update') {
    return null
  }

  if (field.name === 'kode' && typeof value === 'string') {
    if (value.trim() === '') return `${field.label} wajib diisi`
    return null
  }

  if (isEmpty(value)) {
    return `${field.label} wajib diisi`
  }

  return null
}

export function validateMasterForm(
  fields: FormField[],
  values: Record<string, unknown>,
  isEdit?: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {}

  fields.forEach((field) => {
    const message = validateMasterField(field, values, isEdit)
    if (message) errors[field.name] = message
  })

  return errors
}
