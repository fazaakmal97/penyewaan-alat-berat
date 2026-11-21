function runPrint(bodyClass: string): void {
  document.body.classList.add(bodyClass)

  const cleanup = () => {
    document.body.classList.remove(bodyClass)
  }

  window.addEventListener('afterprint', cleanup, { once: true })
  window.setTimeout(cleanup, 1000)

  window.print()
}

/** Cetak invoice customer */
export function printInvoiceArea(): void {
  runPrint('printing-invoice')
}

/** Cetak bukti pembayaran customer */
export function printPaymentProofArea(): void {
  runPrint('printing-payment-proof')
}
