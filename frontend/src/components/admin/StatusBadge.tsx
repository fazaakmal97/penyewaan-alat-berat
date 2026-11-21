import { Badge } from '@/components/ui/badge'

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? 'success' : 'destructive'}>
      {active ? 'Aktif' : 'Nonaktif'}
    </Badge>
  )
}
