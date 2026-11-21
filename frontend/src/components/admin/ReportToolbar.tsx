import { Button } from '@/components/ui/button'
import { FileSpreadsheet, FileText, Printer } from 'lucide-react'

interface ReportToolbarProps {
  onPrint: () => void
  onPdf: () => void
  onExcel: () => void
  disabled?: boolean
}

export function ReportToolbar({ onPrint, onPdf, onExcel, disabled }: ReportToolbarProps) {
  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onPrint} disabled={disabled}>
        <Printer className="h-4 w-4" />
        Cetak
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onPdf} disabled={disabled}>
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onExcel} disabled={disabled}>
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
    </div>
  )
}
