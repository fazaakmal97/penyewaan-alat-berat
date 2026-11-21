/** Field yang tidak boleh dikirim saat multipart upload */
const DEFAULT_EXCLUDE = new Set([
  'id',
  'created_at',
  'updated_at',
  'deleted_at',
  'created_by',
  'updated_by',
  'foto_url',
  'foto_name',
  'bukti_url',
  'bukti_name',
])

function isTruthyActive(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on'
}

function appendFormValue(fd: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return
  if (value instanceof File) return
  if (typeof value === 'object') return
  if (value === '') return

  if (key === 'is_active' || key.endsWith('_active')) {
    fd.append(key, isTruthyActive(value) ? '1' : '0')
    return
  }

  if (typeof value === 'boolean') {
    fd.append(key, value ? '1' : '0')
    return
  }

  fd.append(key, String(value))
}

/**
 * Bangun FormData untuk upload file + field form.
 * Boolean dikirim sebagai "1"/"0" agar validasi Laravel `boolean` tidak gagal.
 */
export function buildFormDataWithFile(
  values: Record<string, unknown>,
  fileField: string,
  extraExclude: string[] = [],
): FormData | null {
  const file = values[fileField]
  if (!(file instanceof File)) return null

  const exclude = new Set([...DEFAULT_EXCLUDE, ...extraExclude])
  const fd = new FormData()
  fd.append(fileField, file)

  for (const [key, value] of Object.entries(values)) {
    if (key === fileField || exclude.has(key)) continue
    appendFormValue(fd, key, value)
  }

  return fd
}
