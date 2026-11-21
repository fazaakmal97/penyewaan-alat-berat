import type { AxiosError } from 'axios'

export interface ApiErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorBody(error: unknown): ApiErrorBody | undefined {
  return (error as AxiosError<ApiErrorBody>)?.response?.data
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  const errors = getApiErrorBody(error)?.errors
  if (!errors) return {}

  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [key, messages[0] ?? '']),
  )
}

export function getApiErrorMessage(error: unknown, fallback = 'Terjadi kesalahan'): string {
  const body = getApiErrorBody(error)
  if (!body) return fallback

  if (body.errors) {
    const messages = Object.values(body.errors).flat().filter(Boolean)
    if (messages.length === 1) return messages[0]
    if (messages.length > 1) return messages.join(' · ')
  }

  return body.message ?? fallback
}
