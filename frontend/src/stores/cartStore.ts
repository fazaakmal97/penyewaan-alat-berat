import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AlatBerat, CartItem } from '@/types'
import { isAlatTersedia } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (alat: AlatBerat, tglMulai: string, tglSelesai: string) => boolean
  removeItem: (alatBeratId: number) => void
  clear: () => void
  total: () => number
}

function hitungHari(mulai: string, selesai: string): number {
  const start = new Date(mulai)
  const end = new Date(selesai)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return Math.max(1, diff)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (alat, tglMulai, tglSelesai) => {
        if (!isAlatTersedia(alat.status)) {
          return false
        }
        const jumlahHari = hitungHari(tglMulai, tglSelesai)
        const subtotal = jumlahHari * Number(alat.harga_sewa_harian)
        const items = get().items.filter((i) => i.alat_berat_id !== alat.id)
        items.push({
          alat_berat_id: alat.id,
          alat,
          tgl_mulai: tglMulai,
          tgl_selesai: tglSelesai,
          jumlah_hari: jumlahHari,
          subtotal,
        })
        set({ items })
        return true
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.alat_berat_id !== id) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),
    }),
    { name: 'cart-storage' },
  ),
)
