/**
 * Main Zustand store factory
 * Combines all slices into a unified store following slice-based architecture
 */
'use client'

import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import {
  AuthState,
  createAuthSlice,
  initialAuthState,
} from './slices/auth.slice'
import {
  UserState,
  createUserSlice,
  initialUserState,
} from './slices/user.slice'
import {
  RenterState,
  createRenterSlice,
  initialRenterState,
} from './slices/renter.slice'

/**
 * Combined store state interface
 * Extends all slice states into a unified interface
 */
export interface StoreState extends AuthState, UserState, RenterState {
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
 * Default initial state combining all slices
 */
const defaultInitialState = {
  ...initialAuthState,
  ...initialUserState,
  ...initialRenterState,
  _storeVersion: '1.0.0',
  _lastUpdated: new Date().toISOString(),
} as const satisfies Partial<StoreState>

/**
 * Store persistence configuration factory
 */
const createPersistConfig = (): StorePersistConfig => ({
  name: 'storefront-auth-store',
  version: 1,

  // Minimal persistence - only essential auth data
  // User profile is fetched from API, not persisted
  partialize: (state: StoreState) => ({
    authKey: state.authKey,
    userId: state.userId,
    isAuthenticated: state.isAuthenticated,
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

      // Add auth slice actions
      ...createAuthSlice(set, get, api),

      // Add user slice actions
      ...createUserSlice(set, get, api),

      // Add renter slice actions
      ...createRenterSlice(set, get, api),
    }))
  }

  // Client-side: create store with persistence
  return createStore<StoreState>()(
    persist(
      (set, get, api) => ({
        // Initialize with merged state
        ...mergedInitialState,

        // Add auth slice actions
        ...createAuthSlice(set, get, api),

        // Add user slice actions
        ...createUserSlice(set, get, api),

        // Add renter slice actions
        ...createRenterSlice(set, get, api),
      }),
      createPersistConfig(),
    ),
  )
}

/**
 * Store type for TypeScript
 */
export type AppStore = ReturnType<typeof createAppStore>
