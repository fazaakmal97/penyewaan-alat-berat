import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { AdminLoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { SewaAdminPage } from '@/pages/admin/SewaPage'
import { PembayaranAdminPage } from '@/pages/admin/PembayaranPage'
import { LaporanPage } from '@/pages/admin/LaporanPage'
import { CustomerPage } from '@/pages/admin/master/CustomerPage'
import { JenisAlatPage } from '@/pages/admin/master/JenisAlatPage'
import { MerekPage } from '@/pages/admin/master/MerekPage'
import { ModelPage } from '@/pages/admin/master/ModelPage'
import { AlatBeratPage } from '@/pages/admin/master/AlatBeratPage'
import { BankPage } from '@/pages/admin/master/BankPage'
import { UserPage } from '@/pages/admin/master/UserPage'
import { HomePage } from '@/pages/customer/HomePage'
import { KatalogPage } from '@/pages/customer/KatalogPage'
import { DetailAlatPage } from '@/pages/customer/DetailAlatPage'
import { KeranjangPage } from '@/pages/customer/KeranjangPage'
import { CheckoutPage } from '@/pages/customer/CheckoutPage'
import { RiwayatPage } from '@/pages/customer/RiwayatPage'
import { CustomerLoginPage } from '@/pages/customer/LoginPage'
import { RegisterPage } from '@/pages/customer/RegisterPage'
import { PembayaranPage } from '@/pages/customer/PembayaranPage'
import { CaraSewaPage } from '@/pages/customer/CaraSewaPage'
import { TentangPage } from '@/pages/customer/TentangPage'
import { FaqPage } from '@/pages/customer/FaqPage'
import { KontakPage } from '@/pages/customer/KontakPage'
import { hasAdminSession, hasCustomerSession } from '@/utils/authToken'
import { useAuthStore } from '@/stores/authStore'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const adminToken = useAuthStore((s) => s.adminToken)

  if (!hasAdminSession() || !adminToken) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}

function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const customerToken = useAuthStore((s) => s.customerToken)

  if (!hasCustomerSession() || !customerToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'katalog', element: <KatalogPage /> },
      { path: 'cara-sewa', element: <CaraSewaPage /> },
      { path: 'tentang', element: <TentangPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'alat/:id', element: <DetailAlatPage /> },
      { path: 'keranjang', element: <KeranjangPage /> },
      { path: 'login', element: <CustomerLoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'checkout',
        element: (
          <CustomerAuthGuard>
            <CheckoutPage />
          </CustomerAuthGuard>
        ),
      },
      {
        path: 'riwayat',
        element: (
          <CustomerAuthGuard>
            <RiwayatPage />
          </CustomerAuthGuard>
        ),
      },
      {
        path: 'pembayaran/:sewaId',
        element: (
          <CustomerAuthGuard>
            <PembayaranPage />
          </CustomerAuthGuard>
        ),
      },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'sewa', element: <SewaAdminPage /> },
      { path: 'pembayaran', element: <PembayaranAdminPage /> },
      { path: 'laporan', element: <LaporanPage /> },
      { path: 'customers', element: <CustomerPage /> },
      { path: 'jenis-alat', element: <JenisAlatPage /> },
      { path: 'merek', element: <MerekPage /> },
      { path: 'model', element: <ModelPage /> },
      { path: 'alat-berat', element: <AlatBeratPage /> },
      { path: 'bank', element: <BankPage /> },
      { path: 'users', element: <UserPage /> },
    ],
  },
])
