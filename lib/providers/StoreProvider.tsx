/**
 * Store Provider with proper SSR/SSG hydration handling
 * Simplified for cart-only functionality
 */
'use client'

import type { AppStore } from '@/lib/stores/store'
import { createAppStore, StoreState } from '@/lib/stores/store'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useStore as useZustandStore } from 'zustand'
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

/**
 * Hook to use the store with type-safe selectors
 * Must be used within StoreProvider
 */
export function useAppStore<T>(selector: (state: StoreState) => T): T {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useAppStore must be used within StoreProvider')
  }

  return useZustandStore(store, selector)
}

/**
 * Hook to access cart state and actions only
 * Returns only cart-related properties for better separation of concerns
 */
export const useCart = () => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useCart must be used within StoreProvider')
  }

  return useZustandStore(
    store,
    useShallow(state => {
      // Calculate computed properties reactively
      const totalItems = state.items?.reduce((total, item) => total + item.quantity, 0) || 0
      const totalPrice = state.items?.reduce((total, item) => {
        const itemPrice = item.discountPercentage 
          ? item.price - (item.price * item.discountPercentage / 100)
          : item.price
        return total + (itemPrice * item.quantity)
      }, 0) || 0
      const itemCount = state.items?.length || 0
      const isEmpty = itemCount === 0

      console.log('🛒 useCart hook state:', { 
        items: state.items, 
        totalItems, 
        itemCount, 
        isEmpty 
      })

      return {
        // Cart state
        items: state.items,
        isOpen: state.isOpen,
        isLoading: state.isLoading,
        error: state.error,

        // Cart actions
        addItem: state.addItem,
        removeItem: state.removeItem,
        updateQuantity: state.updateQuantity,
        clearCart: state.clearCart,
        toggleCart: state.toggleCart,
        setCartOpen: state.setCartOpen,
        setLoading: state.setLoading,
        setError: state.setError,
        clearError: state.clearError,

        // Computed properties (calculated reactively)
        totalItems,
        totalPrice,
        itemCount,
        isEmpty,
      }
    }),
  )
}

/**
 * Hook to access the entire store
 * Use this for cart and other global state access
 */
export const useStore = <T,>(selector: (state: StoreState) => T): T => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return useZustandStore(store, selector)
}