/**
 * Centralized exports for Zustand store hooks
 * Clean architecture with single source of truth
 */

// Re-export hydration utilities
export { useHydration, useStoreHydration } from '../useHydration'

// Store provider hooks exported directly from StoreProvider
export { useAppStore, useCart } from '@/lib/providers/StoreProvider'

// Usage pattern - import hooks directly from StoreProvider:
// import { useAuth, useUser } from '@/lib/providers/StoreProvider'
//
// const { isAuthenticated, authKey, userId, otpRequestId, isLoading, error, setAuthData, setOtpRequestId, setLoading, setError, clearAuth } = useAuth()
// const { profile, isLoading, error, setProfile, updateProfile, clearProfile, setLoading, setError, needsProfileCompletion, hasValidProfile } = useUser()
