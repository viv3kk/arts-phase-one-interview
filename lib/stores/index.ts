/**
 * Centralized exports for Zustand stores
 * Following slice-based architecture from host-consumer-website
 */

// Store provider and main hooks
export {
  AppStoreProvider,
  useAppStore,
  useAuth,
  useUser,
  useRenter,
} from '@/lib/providers/StoreProvider'

// Store factory and types
export { createAppStore } from './store'
export type { StoreState, AppStore } from './store'

// Slice types
export type { AuthState } from './slices/auth.slice'
export type { UserState, User } from './slices/user.slice'

// Legacy compatibility
export type { StoreConfig, HydrationState } from './types'
