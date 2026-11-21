import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { jenisAlatConfig } from '@/features/master/configs'

export function JenisAlatPage() {
  return <MasterCrudPage config={jenisAlatConfig} />
}
