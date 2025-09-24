/**
 * Root providers component that combines all providers needed for the app
 * Following the simplified pattern from host-consumer-website
 */
'use client'

import { AppStoreProvider } from './StoreProvider'
import { QueryProvider } from './QueryProvider'
import { ReactNode } from 'react'
import type { StoreState } from '@/lib/stores/store'

interface ProvidersProps {
  children: ReactNode
  initialState?: Partial<StoreState>
}

/**
 * Providers component following host-consumer-website pattern
 * Combines Zustand store and React Query client providers
 */
export function Providers({ children, initialState }: ProvidersProps) {
  return (
    <AppStoreProvider initialState={initialState}>
      {/* Provide React Query client (keeping DevTools as requested) */}
      <QueryProvider>{children}</QueryProvider>
    </AppStoreProvider>
  )
}
