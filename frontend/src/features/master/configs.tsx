import { masterService } from '@/services/masterService'
import { MasterPhotoCell } from '@/components/admin/MasterPhotoCell'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatRupiah } from '@/utils/format'
import { buildFormDataWithFile } from '@/utils/formData'
import type { MasterConfig } from './types'
import type { AlatBerat, Bank, Customer, JenisAlat, Merek, ModelAlat, User } from '@/types'
import { ALAT_STATUS } from '@/types'

async function fetchJenisOptions() {
  const res = await masterService.list<JenisAlat>('jenis-alat', { per_page: 100, is_active: true })
  return res.data.data.data.map((j) => ({ value: j.id, label: `${j.kode} - ${j.nama}` }))
}

async function fetchMerekOptions() {
  const res = await masterService.list<Merek>('merek', { per_page: 100, is_active: true })
  return res.data.data.data.map((m) => ({ value: m.id, label: `${m.kode} - ${m.nama}` }))
}

async function fetchModelOptions() {
  const res = await masterService.list<ModelAlat>('model', { per_page: 100, is_active: true })
  return res.data.data.data.map((m) => ({ value: m.id, label: `${m.kode} - ${m.nama}` }))
}

export const customerConfig: MasterConfig<Customer & { deleted_at?: string }> = {
  resource: 'customers',
  title: 'Customer',
  description: 'Kelola data pelanggan penyewaan',
  columns: [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'no_hp', label: 'No. HP' },
    { key: 'pic', label: 'PIC' },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={r.is_active} /> },
  ],
  formFields: [
    { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'Contoh: CST-001' },
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'no_hp', label: 'No. HP', type: 'text', required: true },
    { name: 'alamat', label: 'Alamat', type: 'textarea' },
    { name: 'pic', label: 'PIC', type: 'text' },
    { name: 'password', label: 'Password', type: 'password', required: true, showOn: 'create' },
    { name: 'password', label: 'Password Baru', type: 'password', showOn: 'update' },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
  toPayload: (values, isEdit) => {
    const payload = { ...values }
    if (isEdit && !payload.password) delete payload.password
    return payload
  },
}

export const jenisAlatConfig: MasterConfig<JenisAlat & { deleted_at?: string; is_active?: boolean }> = {
  resource: 'jenis-alat',
  title: 'Jenis Alat',
  description: 'Kategori jenis alat berat',
  columns: [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={!!r.is_active} /> },
  ],
  formFields: [
    { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'Contoh: JA-001' },
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
}

export const merekConfig: MasterConfig<Merek & { deleted_at?: string; is_active?: boolean }> = {
  resource: 'merek',
  title: 'Merek',
  description: 'Merek / brand alat berat',
  columns: [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={!!r.is_active} /> },
  ],
  formFields: [
    { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'Contoh: MR-001' },
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
}

export const modelConfig: MasterConfig<ModelAlat & { deleted_at?: string; is_active?: boolean; jenis_alat_id?: number; merek_id?: number }> = {
  resource: 'model',
  title: 'Model Alat',
  description: 'Model spesifik alat berat',
  columns: [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'jenis_alat', label: 'Jenis', render: (r) => r.jenis_alat?.nama ?? r.jenisAlat?.nama ?? '-' },
    { key: 'merek', label: 'Merek', render: (r) => r.merek?.nama ?? '-' },
    { key: 'kapasitas', label: 'Kapasitas' },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={!!r.is_active} /> },
  ],
  formFields: [
    { name: 'jenis_alat_id', label: 'Jenis Alat', type: 'select', required: true, options: fetchJenisOptions },
    { name: 'merek_id', label: 'Merek', type: 'select', required: true, options: fetchMerekOptions },
    { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'Contoh: MD-001' },
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    { name: 'kapasitas', label: 'Kapasitas', type: 'text' },
    { name: 'daya_mesin', label: 'Daya Mesin', type: 'text' },
    { name: 'berat_operasional', label: 'Berat Operasional', type: 'text' },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
  toPayload: (values) => ({
    ...values,
    jenis_alat_id: Number(values.jenis_alat_id),
    merek_id: Number(values.merek_id),
  }),
}

export const alatBeratConfig: MasterConfig<AlatBerat & { deleted_at?: string; is_active?: boolean; model_id?: number }> = {
  resource: 'alat-berat',
  title: 'Alat Berat',
  description: 'Unit alat berat yang disewakan',
  columns: [
    {
      key: 'foto_url',
      label: 'Foto',
      render: (r) => (
        <MasterPhotoCell url={r.foto_url} alt={r.nama} title={`Foto — ${r.nama}`} />
      ),
    },
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'model', label: 'Model', render: (r) => r.model?.nama ?? '-' },
    { key: 'tahun', label: 'Tahun', sortable: true },
    { key: 'harga_sewa_harian', label: 'Harga/Hari', render: (r) => formatRupiah(Number(r.harga_sewa_harian)) },
    { key: 'status', label: 'Status Unit', render: (r) => ALAT_STATUS[r.status] ?? r.status },
    { key: 'is_active', label: 'Aktif', render: (r) => <StatusBadge active={!!r.is_active} /> },
  ],
  formFields: [
    { name: 'foto', label: 'Foto Alat', type: 'file' },
    { name: 'model_id', label: 'Model', type: 'select', required: true, options: fetchModelOptions },
    { name: 'kode', label: 'Kode', type: 'text', required: true, placeholder: 'Contoh: AB-001' },
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'tahun', label: 'Tahun', type: 'year', required: true },
    { name: 'harga_sewa_harian', label: 'Harga Sewa Harian', type: 'number', required: true },
    {
      name: 'status',
      label: 'Status Unit',
      type: 'select',
      options: [
        { value: 0, label: 'Tersedia' },
        { value: 1, label: 'Disewa' },
        { value: 2, label: 'Maintenance' },
      ],
    },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
  toPayload: (values) => {
    const fd = buildFormDataWithFile(values, 'foto', ['model'])
    if (fd) return fd
    const { foto: _, foto_url: __, foto_name: ___, model: ____, ...rest } = values
    return {
      ...rest,
      model_id: Number(rest.model_id),
      tahun: Number(rest.tahun),
      harga_sewa_harian: Number(rest.harga_sewa_harian),
      status: Number(rest.status ?? 0),
    }
  },
}

export const bankConfig: MasterConfig<Bank & { deleted_at?: string; is_active?: boolean }> = {
  resource: 'bank',
  title: 'Bank',
  description: 'Rekening pembayaran',
  columns: [
    {
      key: 'foto_url',
      label: 'Logo',
      render: (r) => (
        <MasterPhotoCell url={r.foto_url} alt={r.nama} title={`Logo — ${r.nama}`} />
      ),
    },
    { key: 'nama', label: 'Bank', sortable: true },
    { key: 'no_rek', label: 'No. Rekening' },
    { key: 'atas_nama', label: 'Atas Nama' },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={!!r.is_active} /> },
  ],
  formFields: [
    { name: 'foto', label: 'Logo Bank', type: 'file' },
    { name: 'nama', label: 'Nama Bank', type: 'text', required: true },
    { name: 'no_rek', label: 'No. Rekening', type: 'text', required: true },
    { name: 'atas_nama', label: 'Atas Nama', type: 'text', required: true },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
  toPayload: (values) => {
    const fd = buildFormDataWithFile(values, 'foto')
    if (fd) return fd
    const { foto: _, foto_url: __, foto_name: ___, ...rest } = values
    return rest
  },
}

export const userConfig: MasterConfig<User & { deleted_at?: string }> = {
  resource: 'users',
  title: 'User Admin',
  description: 'Akun administrator sistem',
  columns: [
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge active={r.is_active} /> },
  ],
  formFields: [
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true, showOn: 'create' },
    { name: 'password', label: 'Password Baru', type: 'password', showOn: 'update' },
    { name: 'is_active', label: 'Status Aktif', type: 'checkbox' },
  ],
  toPayload: (values, isEdit) => {
    const payload = { ...values }
    if (isEdit && !payload.password) delete payload.password
    return payload
  },
}
