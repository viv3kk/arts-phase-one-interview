/**
 * Legacy types - use types/store.types.ts instead
 * This file is kept for backward compatibility only
 */

// Re-export from new unified types
export type { HydrationState, StoreConfig } from '@/lib/types/store.types'

/**
 * @deprecated Use types/store.types.ts instead
 */
export interface LegacyStoreState {
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
