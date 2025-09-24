/**
 * Unified store type definitions
 * Central source of truth for all store-related types
 */

/**
 * Base interfaces for consistent error handling across all slices
 */
export interface BaseError {
  code?: string
  message: string
  details?: Record<string, unknown>
  timestamp?: string
}

/**
 * Base async operation states shared across all slices
 */
export interface BaseAsyncState {
  isLoading: boolean
  error: string | null
}

/**
 * Generic async operation result
 */
export interface AsyncResult<T = unknown> extends BaseAsyncState {
  data: T | null
  success: boolean
}

/**
 * Base slice interface that all slices should extend
 */
export interface BaseSlice extends BaseAsyncState {
  // Common loading/error actions
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

/**
 * Store hydration state
 */
export interface HydrationState {
  _hasHydrated: boolean
  _isHydrating: boolean
  setHasHydrated: (state: boolean) => void
  setIsHydrating: (state: boolean) => void
}

/**
 * Generic store configuration
 */
export interface StoreConfig {
  name: string
  version?: string
  enablePersistence?: boolean
  storage?: 'localStorage' | 'sessionStorage'
  partialize?: <T>(state: T) => Partial<T>
  skipHydration?: boolean
}

/**
 * Hook return type wrapper for consistent API
 */
export interface HookResult<TData = unknown, TActions = unknown>
  extends BaseAsyncState {
  data: TData
  actions: TActions
  utils: {
    refresh: () => void
    reset: () => void
  }
}

/**
 * Selector hook type for type-safe store access
 */
export type StoreSelector<TStore, TResult> = (state: TStore) => TResult

/**
 * Action creator type for store actions
 */
export type ActionCreator<TArgs extends unknown[] = []> = (
  ...args: TArgs
) => void

/**
 * Computed property getter type
 */
export type ComputedGetter<TResult> = () => TResult

/**
 * Store slice factory type
 */
export type SliceFactory<TSlice> = (
  set: (
    partial: Partial<TSlice> | ((state: TSlice) => Partial<TSlice>),
  ) => void,
  get: () => TSlice,
  api: unknown,
) => TSlice
