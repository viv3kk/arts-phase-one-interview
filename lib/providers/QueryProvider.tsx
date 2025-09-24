/**
 * React Query Provider with SSR/SSG-friendly configuration
 * Integrates with Zustand for coordinated state management
 */
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

/**
 * Create a new QueryClient instance with conservative defaults
 * Following host-consumer-website pattern for better SSR/SSG compatibility
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Match host-consumer configuration exactly
        refetchOnMount: false, // Better for SSR - don't refetch on mount
        refetchOnWindowFocus: false, // Less aggressive refetching
        staleTime: 5 * 60 * 1000, // 5 minutes (vs our previous 1 minute)
        gcTime: 10 * 60 * 1000, // 10 minutes cache time
        retry: 1, // Simple retry logic (vs our complex retry function)
      },
      // Remove global mutation error handler - handle errors in individual hooks
    },
  })
}

/**
 * React Query Provider component
 * Provides React Query client to the entire app
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance only once
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
