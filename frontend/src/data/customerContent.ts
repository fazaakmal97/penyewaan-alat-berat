import type { FaqItem } from '@/components/customer/FaqAccordion'

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pilih Alat',
    desc: 'Jelajahi katalog, filter berdasarkan jenis dan harga, lalu pilih unit yang sesuai proyek.',
  },
  {
    step: '02',
    title: 'Atur Jadwal Sewa',
    desc: 'Tentukan tanggal mulai dan selesai sewa. Sistem menghitung total biaya secara otomatis.',
  },
  {
    step: '03',
    title: 'Verifikasi Admin',
    desc: 'Pesanan diverifikasi admin. Setelah disetujui, lanjut ke pembayaran.',
  },
  {
    step: '04',
    title: 'Bayar & Upload Bukti',
    desc: 'Transfer ke rekening yang tersedia, lalu unggah bukti pembayaran.',
  },
  {
    step: '05',
    title: 'Unit Dikirim',
    desc: 'Setelah pembayaran diverifikasi, unit dikirim ke lokasi proyek Anda.',
  },
]

export const COMPANY_PROFILE = {
  image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  title: 'PT. Masendo Karya Mandiri',
  description: [
    'PT. Masendo Karya Mandiri adalah perusahaan penyedia jasa sewa alat berat yang melayani sektor konstruksi, pertambangan, dan infrastruktur di seluruh Indonesia.',
    'Kami menghadirkan armada excavator, bulldozer, crane, dan unit pendukung lainnya dengan standar perawatan tinggi serta proses penyewaan yang mudah diakses secara online.',
    'Berkomitmen pada layanan yang andal dan transparan, kami siap mendukung kelancaran operasional proyek Anda dari awal hingga selesai.',
  ],
}

export const WHY_US = [
  {
    title: 'Armada Lengkap',
    desc: 'Excavator, bulldozer, crane, loader, dan alat pendukung lainnya dalam satu platform.',
  },
  {
    title: 'Perawatan Berkala',
    desc: 'Setiap unit dicek sebelum disewa untuk memastikan kesiapan operasional di lapangan.',
  },
  {
    title: 'Harga Harian Jelas',
    desc: 'Tarif sewa per hari ditampilkan transparan sejak awal — tanpa biaya tersembunyi.',
  },
  {
    title: 'Dukungan Responsif',
    desc: 'Tim kami siap membantu proses booking, pembayaran, dan koordinasi pengiriman unit.',
  },
]

export const INDUSTRIES = [
  'Konstruksi',
  'Pertambangan',
  'Infrastruktur',
  'Perkebunan',
  'Properti',
  'Energi',
]

export const STATS = [
  { value: '500+', label: 'Unit Alat Berat' },
  { value: '1.200+', label: 'Transaksi Selesai' },
  { value: '350+', label: 'Pelanggan Aktif' },
  { value: '15+', label: 'Kota Terlayani' },
]

export const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Kontraktor Konstruksi',
    quote: 'Proses sewa sangat praktis. Dari pemilihan excavator hingga pembayaran, semuanya bisa online.',
  },
  {
    name: 'Dewi Lestari',
    role: 'Manajer Proyek',
    quote: 'Unit yang disewa selalu dalam kondisi baik. Tim support juga cepat merespons setiap pertanyaan.',
  },
  {
    name: 'Agus Wijaya',
    role: 'Pengusaha Tambang',
    quote: 'Harga transparan dan jadwal pengiriman jelas. Sangat membantu operasional di site kami.',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Bagaimana cara menyewa alat berat?',
    answer:
      'Daftar akun, pilih alat di katalog, tentukan tanggal sewa, tambahkan ke keranjang, lalu lakukan checkout. Setelah itu upload bukti pembayaran untuk diverifikasi admin.',
  },
  {
    question: 'Berapa minimal durasi sewa?',
    answer: 'Minimal sewa adalah 1 hari. Perhitungan otomatis berdasarkan tanggal mulai dan tanggal selesai yang Anda pilih.',
  },
  {
    question: 'Apakah harga sudah termasuk operator?',
    answer:
      'Harga yang ditampilkan adalah tarif sewa unit per hari. Biaya operator, bahan bakar, dan transportasi dapat dikenakan sesuai kesepakatan tambahan.',
  },
  {
    question: 'Berapa lama verifikasi pembayaran?',
    answer: 'Verifikasi pembayaran biasanya dilakukan dalam 1×24 jam kerja setelah bukti transfer diunggah.',
  },
  {
    question: 'Apakah unit dikirim ke lokasi proyek?',
    answer:
      'Ya, setelah pembayaran diverifikasi, tim kami akan mengkoordinasikan pengiriman unit ke alamat yang Anda cantumkan saat checkout.',
  },
  {
    question: 'Bagaimana jika ingin memperpanjang masa sewa?',
    answer: 'Hubungi tim kami melalui halaman Kontak sebelum masa sewa berakhir untuk proses perpanjangan.',
  },
]

export const FAQ_PREVIEW = FAQ_ITEMS.slice(0, 4)
