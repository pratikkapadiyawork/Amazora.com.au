'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(12,4,32,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(211,145,176,0.2)',
            color: '#F5F0F2',
            borderRadius: '14px',
            fontFamily: 'var(--font-jakarta)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
