/**
 * Main Zustand store factory
 * Combines all slices into a unified store following slice-based architecture
 */
'use client'

import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import {
  CartState,
  createCartSlice,
  initialCartState,
} from './slices/cart.slice'

/**
 * Store state interface - only cart functionality
 */
export interface StoreState extends CartState {
  // Store metadata
  _storeVersion: string
  _lastUpdated: string
}

/**
 * Store persistence configuration
 */
interface StorePersistConfig {
  name: string
  version: number
  partialize: (state: StoreState) => Partial<StoreState>
  storage: ReturnType<typeof createJSONStorage>
  skipHydration: boolean
}

/**
 * Default initial state - only cart
 */
const defaultInitialState = {
  ...initialCartState,
  _storeVersion: '1.0.0',
  _lastUpdated: new Date().toISOString(),
} as const satisfies Partial<StoreState>

/**
 * Store persistence configuration factory
 */
const createPersistConfig = (): StorePersistConfig => ({
  name: 'storefront-cart-store',
  version: 1,

  // Persist cart items only
  partialize: (state: StoreState) => ({
    items: state.items,
    isOpen: state.isOpen,
    _storeVersion: state._storeVersion,
    _lastUpdated: state._lastUpdated,
  }),

  // Server-safe storage with fallback
  storage: createJSONStorage(() => {
    if (typeof window === 'undefined') {
      // Server-side: return a no-op storage
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    }
    return localStorage
  }),

  // Skip automatic hydration in SSR, handle manually
  skipHydration: true,
})

/**
 * Store factory function
 * Creates a new store instance per request (SSR-safe)
 * Following the official Zustand Next.js guide pattern
 */
export const createAppStore = (initialState: Partial<StoreState> = {}) => {
  const mergedInitialState = {
    ...defaultInitialState,
    ...initialState,
    _lastUpdated: new Date().toISOString(),
  }

  // Create store with conditional persistence
  if (typeof window === 'undefined') {
    // Server-side: create store without persistence
    return createStore<StoreState>()((set, get, api) => ({
      // Initialize with merged state
      ...mergedInitialState,

      // Add cart slice actions
      ...createCartSlice(set, get, api),
    }))
  }

  // Client-side: create store with persistence
  return createStore<StoreState>()(
    persist(
      (set, get, api) => ({
        // Initialize with merged state
        ...mergedInitialState,

        // Add cart slice actions
        ...createCartSlice(set, get, api),
      }),
      createPersistConfig(),
    ),
  )
}

/**
 * Store type for TypeScript
 */
export type AppStore = ReturnType<typeof createAppStore>
