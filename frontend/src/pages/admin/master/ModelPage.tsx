import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { modelConfig } from '@/features/master/configs'

export function ModelPage() {
  return <MasterCrudPage config={modelConfig} />
}
