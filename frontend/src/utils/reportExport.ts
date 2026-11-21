import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ExportColumn<TRow> {
  header: string
  accessor: (row: TRow) => string | number
}

export function exportReportExcel<TRow>(
  filename: string,
  sheetName: string,
  columns: ExportColumn<TRow>[],
  rows: TRow[],
  summaryRows?: (string | number)[][],
): void {
  const headerRow = columns.map((c) => c.header)
  const dataRows = rows.map((row) => columns.map((c) => c.accessor(row)))
  const aoa = summaryRows ? [...summaryRows, [], headerRow, ...dataRows] : [headerRow, ...dataRows]

  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportReportPdf<TRow>(
  filename: string,
  title: string,
  subtitle: string,
  columns: ExportColumn<TRow>[],
  rows: TRow[],
  footerLines: string[],
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(10)
  doc.setTextColor(80)
  doc.text(subtitle, 14, 23)
  doc.setTextColor(0)

  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => String(c.accessor(row)))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [245, 158, 11], textColor: 20 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 28
  let y = finalY + 8
  doc.setFontSize(9)
  footerLines.forEach((line) => {
    doc.text(line, 14, y)
    y += 5
  })

  doc.save(`${filename}.pdf`)
}

/** Cetak area laporan — tanpa popup (hindari pemblokir browser) */
export function printReportArea(elementId: string): void {
  const el = document.getElementById(elementId)
  if (!el) {
    window.print()
    return
  }

  document.body.classList.add('printing-report')

  const cleanup = () => {
    document.body.classList.remove('printing-report')
  }

  window.addEventListener('afterprint', cleanup, { once: true })

  // Fallback jika afterprint tidak terpanggil (beberapa browser)
  window.setTimeout(cleanup, 1000)

  window.print()
}
