/**
 * Store Provider with proper SSR/SSG hydration handling
 * Follows the official Zustand Next.js guide pattern
 */
'use client'

import type { AppStore } from '@/lib/stores/store'
import { createAppStore, StoreState } from '@/lib/stores/store'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

/**
 * Store context for sharing store across components
 */
export const StoreContext = createContext<AppStore | null>(null)

/**
 * Props for the StoreProvider
 */
interface AppStoreProviderProps {
  children: React.ReactNode
  initialState?: Partial<StoreState>
}

/**
 * Store Provider Component
 * Creates a new store per request for SSR compatibility
 * Handles manual hydration with proper loading states
 */
export function AppStoreProvider({
  children,
  initialState,
}: AppStoreProviderProps) {
  // Create store instance once per component mount
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    // eslint-disable-next-line
    storeRef.current = createAppStore(initialState as any)
  }

  // Handle client-side hydration
  useEffect(() => {
    const handleHydration = async () => {
      if (storeRef.current && typeof window !== 'undefined') {
        try {
          // Check if store has persist API (client-side only)
          const store = storeRef.current as {
            persist?: { rehydrate: () => Promise<void> }
          }
          if (store.persist && typeof store.persist.rehydrate === 'function') {
            // Rehydrate the store from localStorage
            await store.persist.rehydrate()
          }

          // After hydration completes, set loading to false
          const state = storeRef.current.getState()
          if (state.isLoading) {
            storeRef.current.setState({ isLoading: false })
          }
        } catch (error) {
          console.error('Failed to rehydrate store:', error)

          // Even on error, we should stop showing loading state
          if (storeRef.current) {
            storeRef.current.setState({ isLoading: false })
          }
        }
      }
    }

    handleHydration()
  }, [])

  // Debug state changes in development
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && storeRef.current) {
      const unsubscribe = storeRef.current.subscribe(state => {
        console.log('Store state changed:', state)
      })
      return () => unsubscribe()
    }
  }, [])

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

// Note: Use AppStoreProvider directly - no aliases for cleaner architecture

/**
 * Hook to use the store with type-safe selectors
 * Must be used within StoreProvider
 */
export function useAppStore<T>(selector: (state: StoreState) => T): T {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useAppStore must be used within StoreProvider')
  }

  return useStore(store, selector)
}

/**
 * Hook to access auth state and actions only
 * Returns only auth-related properties for better separation of concerns
 */
export const useAuth = (): import('@/lib/types/hooks.types').AuthHookResult => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useAuth must be used within StoreProvider')
  }

  return useStore(
    store,
    useShallow(state => ({
      // Auth state
      authKey: state.authKey,
      userId: state.userId,
      isAuthenticated: state.isAuthenticated,
      otpRequestId: state.otpRequestId,
      isGoogleAuthInProgress: state.isGoogleAuthInProgress,
      authMethod: state.authMethod,
      isLoading: state.isLoading, // ✅ Shared pattern
      error: state.error, // ✅ Shared pattern

      // Modal state
      isModalOpen: state.isModalOpen,
      onSuccessCallback: state.onSuccessCallback,

      // Auth actions
      setAuthData: state.setAuthData,
      setOtpRequestId: state.setOtpRequestId,
      setIsGoogleAuthInProgress: state.setIsGoogleAuthInProgress,
      setAuthMethod: state.setAuthMethod,
      setLoading: state.setLoading,
      setError: state.setError,
      clearError: state.clearError,
      clearAuth: state.clearAuth,
      setIsAuthenticated: state.setIsAuthenticated,

      // Modal actions
      openLoginModal: state.openLoginModal,
      closeLoginModal: state.closeLoginModal,
      setSuccessCallback: state.setSuccessCallback,
      loginSuccessCallback: state.loginSuccessCallback,

      // Computed properties
      hasValidSession: state.hasValidSession,
      needsAuthentication: state.needsAuthentication,
    })),
  )
}

/**
 * Hook to access user state and actions only
 * Returns only user-related properties for better separation of concerns
 */
export const useUser = (): import('@/lib/types/hooks.types').UserHookResult => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useUser must be used within StoreProvider')
  }

  return useStore(
    store,
    useShallow(state => ({
      // User state
      profile: state.profile,
      isLoading: state.isLoading, // ✅ Shared pattern
      error: state.error, // ✅ Shared pattern
      // User actions
      setProfile: state.setProfile,
      updateProfile: state.updateProfile,
      clearProfile: state.clearProfile,
      setLoading: state.setLoading,
      setError: state.setError,
      clearError: state.clearError,
      // Computed getters
      needsProfileCompletion: state.needsProfileCompletion,
      hasValidProfile: state.hasValidProfile,
      getUserDisplayName: state.getUserDisplayName,
    })),
  )
}

/**
 * Hook to access renter state and actions only
 * Returns only renter-related properties for better separation of concerns
 * Follows the exact same pattern as useAuth and useUser
 */
export const useRenter =
  (): import('@/lib/types/hooks.types').RenterHookResult => {
    const store = useContext(StoreContext)

    if (!store) {
      throw new Error('useRenter must be used within StoreProvider')
    }

    return useStore(
      store,
      useShallow(state => ({
        // Renter state
        renterProfile: state.renterProfile,
        isLoading: state.isLoading, // ✅ Shared pattern
        error: state.error, // ✅ Shared pattern
        // Renter actions
        setRenterProfile: state.setRenterProfile,
        updateRenterProfile: state.updateRenterProfile,
        clearRenterProfile: state.clearRenterProfile,
        setLoading: state.setLoading,
        setError: state.setError,
        clearError: state.clearError,
        // Computed getters
        hasInsuranceProof: state.hasInsuranceProof,
        hasDriverLicense: state.hasDriverLicense,
        isRenterProfileComplete: state.isRenterProfileComplete,
        getRenterDisplayName: state.getRenterDisplayName,
      })),
    )
  }
