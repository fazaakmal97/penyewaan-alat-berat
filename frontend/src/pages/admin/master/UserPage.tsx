import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { userConfig } from '@/features/master/configs'

export function UserPage() {
  return <MasterCrudPage config={userConfig} />
}
