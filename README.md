# Sistem Penyewaan Alat Berat Berbasis Web

Aplikasi rental alat berat dengan dua portal: **Admin** dan **Customer**.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12, Sanctum, Eloquent |
| Frontend | React 19, TypeScript, Vite |
| Database | MySQL |
| UI | TailwindCSS, Shadcn/UI |
| State | Zustand |
| Data Fetching | TanStack React Query |

## Struktur Project

```
alat-berat/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Enums/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   │   ├── Contracts/
│   │   │   └── Eloquent/
│   │   ├── Services/
│   │   └── Traits/
│   ├── database/
│   └── routes/api.php
├── frontend/         # React SPA
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── stores/
│       ├── types/
│       └── utils/
└── docker/           # Deployment (opsional)
```

## Status Penyewaan

| Kode | Label |
|------|-------|
| 0 | Draft |
| 1 | Menunggu Pembayaran |
| 2 | Menunggu Verifikasi |
| 3 | Disetujui |
| 4 | Sedang Berjalan |
| 5 | Selesai |
| 6 | Ditolak |
| 7 | Dibatalkan |

## Setup Lokal

### Backend

```bash
cd backend
cp .env.example .env
# Sesuaikan DB_* di .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Akun Default (Seeder)

| Role | Username/Email | Password |
|------|----------------|----------|
| Admin | admin | password |
| Customer | customer@demo.com | password |

### Data Testing (Factory)

```bash
cd backend
php artisan db:seed --class=TestDataSeeder   # tambah 1 sewa + pembayaran pending
php artisan test --filter=FactoryTest        # jalankan test factory
```

Factory tersedia: `User`, `Customer`, `JenisAlat`, `Merek`, `ModelAlat`, `AlatBerat`, `Bank`, `Sewa`, `DetailSewa`, `Pembayaran`.

## API Base URL

`http://localhost:8000/api`

Prefix auth:
- Admin: `/api/admin/*`
- Customer: `/api/customer/*`
- Public katalog: `/api/public/*`
