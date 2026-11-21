import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConfirmProvider } from '@/hooks/useConfirm'
import { router } from '@/routes'
import { useThemeStore } from '@/stores/themeStore'
import { initAuthSessionSync } from '@/utils/authToken'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => initAuthSessionSync(), [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfirmProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </ConfirmProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
