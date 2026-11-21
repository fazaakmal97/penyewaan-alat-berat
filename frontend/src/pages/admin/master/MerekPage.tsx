import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { merekConfig } from '@/features/master/configs'

export function MerekPage() {
  return <MasterCrudPage config={merekConfig} />
}
