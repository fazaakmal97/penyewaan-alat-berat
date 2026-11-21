import type { ReactNode } from 'react'
import type { MasterResource } from '@/services/masterService'

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file' | 'year'

export interface SelectOption {
  value: string | number
  label: string
}

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  showOn?: 'create' | 'update' | 'both'
}

export interface TableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

export interface MasterConfig<T extends { id: number | string }> {
  resource: MasterResource
  title: string
  description?: string
  columns: TableColumn<T>[]
  formFields: FormField[]
  defaultValues?: Record<string, unknown>
  getRowId?: (row: T) => number | string
  toPayload?: (values: Record<string, unknown>, isEdit: boolean) => Record<string, unknown> | FormData
}
