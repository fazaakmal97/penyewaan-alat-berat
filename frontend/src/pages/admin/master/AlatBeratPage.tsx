import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { alatBeratConfig } from '@/features/master/configs'

export function AlatBeratPage() {
  return <MasterCrudPage config={alatBeratConfig} />
}
