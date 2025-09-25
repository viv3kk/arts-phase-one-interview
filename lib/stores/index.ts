/**
 * Centralized exports for Zustand stores
 * Following slice-based architecture from host-consumer-website
 */

// Store provider and main hooks
export {
  AppStoreProvider,
  useStore,
  useCart,
} from '@/lib/providers/StoreProvider'

// Store factory and types
export { createAppStore } from './store'
export type { StoreState, AppStore } from './store'

// Slice types
export type { CartState, CartItem } from './slices/cart.slice'

// Legacy compatibility
export type { StoreConfig, HydrationState } from './types'
