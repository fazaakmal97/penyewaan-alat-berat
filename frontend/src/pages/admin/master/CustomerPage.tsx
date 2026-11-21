import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { customerConfig } from '@/features/master/configs'

export function CustomerPage() {
  return <MasterCrudPage config={customerConfig} />
}
