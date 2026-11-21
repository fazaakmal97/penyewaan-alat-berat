import { MasterCrudPage } from '@/components/admin/MasterCrudPage'
import { bankConfig } from '@/features/master/configs'

export function BankPage() {
  return <MasterCrudPage config={bankConfig} />
}
