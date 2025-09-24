# Zustand State Management Integration Plan

## 📋 Overview

This document outlines the comprehensive integration of Zustand for client-side state management in the Multi-Tenant Car Rental Storefront, considering SSR/SSG compatibility, React Query integration, and persistence requirements.

## 🎯 Integration Goals

### **Primary Objectives**

1. **SSR/SSG Compatibility**: Ensure Zustand works seamlessly with Next.js App Router
2. **React Query Integration**: Coordinate with React Query for server state management
3. **Persistence Strategy**: Implement appropriate persistence for different state types
4. **Multi-Tenant Support**: Tenant-aware state management
5. **Performance Optimization**: Minimize bundle size and optimize re-renders

### **State Management Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    🏗️ State Management Architecture         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🔄 React Query (Server State)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 📊 API Data │  │ 🔄 Cache    │  │ 🔄 Sync     │         │
│  │ Bookings    │  │ Management  │  │ Background  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🗃️ Zustand (Client State)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🎨 UI State  │  │ 🔐 Auth     │  │ ⚙️ Settings │         │
│  │ Toggles     │  │ State       │  │ Preferences │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    💾 Persistence Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🍪 Cookies  │  │ 💾 Local    │  │ 🗄️ Session  │         │
│  │ Auth        │  │ Storage     │  │ Storage     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Implementation Strategy

### **1. Store Architecture**

#### **Store Structure**

```
lib/
├── stores/                    # 🗃️ Zustand stores
│   ├── index.ts              # 📦 Store exports
│   ├── types.ts              # 📝 Store type definitions
│   ├── auth-store.ts         # 🔐 Authentication state
│   ├── ui-store.ts           # 🎨 UI state (modals, toggles)
│   ├── settings-store.ts     # ⚙️ User preferences
│   ├── cart-store.ts         # 🛒 Booking cart state
│   └── tenant-store.ts       # 🏢 Tenant-specific state
├── providers/                 # 🔄 Store providers
│   ├── StoreProvider.tsx     # 🏗️ Store provider wrapper
│   └── StoreHydration.tsx    # 💧 Store hydration
└── hooks/                     # 🪝 Store hooks
    ├── useAuthStore.ts       # 🔐 Auth store hooks
    ├── useUIStore.ts         # 🎨 UI store hooks
    └── useSettingsStore.ts   # ⚙️ Settings store hooks
```

#### **Store Categories**

**🔐 Authentication Store**

```typescript
interface AuthState {
  // Auth state
  isAuthenticated: boolean
  user: User | null
  authKey: string | null

  // Loading states
  isLoading: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean

  // Actions
  login: (authKey: string, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}
```

**🎨 UI Store**

```typescript
interface UIState {
  // Modal states
  modals: {
    login: boolean
    booking: boolean
    filters: boolean
  }

  // UI toggles
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  darkMode: boolean

  // Loading states
  pageLoading: boolean
  globalLoading: boolean

  // Actions
  toggleModal: (modal: keyof UIState['modals']) => void
  toggleSidebar: () => void
  setPageLoading: (loading: boolean) => void
}
```

**⚙️ Settings Store**

```typescript
interface SettingsState {
  // User preferences
  language: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }

  // Display preferences
  theme: 'light' | 'dark' | 'auto'
  compactMode: boolean

  // Actions
  setLanguage: (language: string) => void
  setCurrency: (currency: string) => void
  toggleNotification: (type: keyof SettingsState['notifications']) => void
}
```

**🛒 Cart Store**

```typescript
interface CartState {
  // Cart items
  items: CartItem[]
  total: number

  // Cart metadata
  lastUpdated: Date | null
  expiresAt: Date | null

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}
```

**🏢 Tenant Store**

```typescript
interface TenantState {
  // Tenant context
  currentTenant: TenantContext | null
  tenantHistory: TenantContext[]

  // Tenant preferences
  preferredTenant: string | null

  // Actions
  setCurrentTenant: (tenant: TenantContext) => void
  addToHistory: (tenant: TenantContext) => void
  setPreferredTenant: (tenantId: string) => void
}
```

### **2. SSR/SSG Compatibility for Next.js App Router**

#### **Next.js App Router Specific Considerations**

Based on the [Zustand documentation for Next.js](https://zustand.docs.pmnd.rs/integrations/persisting-store-data#usage-in-next.js), here are the key patterns for SSR/SSG compatibility:

**Store Provider Pattern with Hydration**

```typescript
// lib/providers/StoreProvider.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUIStore } from '@/lib/stores/ui-store'

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Manual hydration for SSR compatibility
    const hydrateStores = async () => {
      try {
        // Rehydrate stores after component mounts
        await Promise.all([
          useAuthStore.persist.rehydrate(),
          useUIStore.persist.rehydrate(),
        ])
        setIsHydrated(true)
      } catch (error) {
        console.error('Failed to hydrate stores:', error)
        setIsHydrated(true) // Continue anyway
      }
    }

    hydrateStores()
  }, [])

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
```

**Store Implementation with skipHydration**

```typescript
// lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from './types'

interface AuthState {
  // State
  isAuthenticated: boolean
  user: User | null
  authKey: string | null

  // Loading states
  isLoading: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean

  // Hydration state
  _hasHydrated: boolean

  // Actions
  login: (authKey: string, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setLoggingIn: (loading: boolean) => void
  setLoggingOut: (loading: boolean) => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      authKey: null,
      isLoading: false,
      isLoggingIn: false,
      isLoggingOut: false,
      _hasHydrated: false,

      // Actions
      login: (authKey, user) =>
        set({
          isAuthenticated: true,
          user,
          authKey,
          isLoggingIn: false,
          isLoading: false,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          authKey: null,
          isLoggingOut: false,
          isLoading: false,
        }),

      setLoading: loading => set({ isLoading: loading }),
      setLoggingIn: loading => set({ isLoggingIn: loading }),
      setLoggingOut: loading => set({ isLoggingOut: loading }),
      setHasHydrated: state => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // Only persist essential auth data
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authKey: state.authKey,
      }),
      skipHydration: true, // Manual hydration for SSR
      onRehydrateStorage: () => state => {
        // Mark as hydrated when rehydration completes
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  ),
)
```

**Custom Hydration Hook**

```typescript
// lib/hooks/useHydration.ts
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUIStore } from '@/lib/stores/ui-store'

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Subscribe to hydration events
    const unsubHydrate = useAuthStore.persist.onHydrate(() =>
      setHydrated(false),
    )
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true),
    )

    // Check if already hydrated
    setHydrated(useAuthStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
```

**App Layout Integration**

```typescript
// app/layout.tsx
import { StoreProvider } from '@/lib/providers/StoreProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ... existing tenant resolution code ...

  return (
    <html lang='en'>
      <head>
        {/* ... existing head content ... */}
      </head>
      <body>
        <StoreProvider>
          <TenantProvider initialConfig={config}>
            <ThemeProvider>{children}</ThemeProvider>
          </TenantProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
```

**Component Usage with Hydration Check**

```typescript
// components/AuthComponent.tsx
'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useHydration } from '@/lib/hooks/useHydration'

export function AuthComponent() {
  const { isAuthenticated, user } = useAuthStore()
  const hasHydrated = useHydration()

  // Show loading until hydration is complete
  if (!hasHydrated) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

#### **Server-Side Considerations**

**Server Component Safety**

```typescript
// lib/stores/server-safe.ts
export const isServer = typeof window === 'undefined'

export const createServerSafeStore = <T>(storeCreator: () => T) => {
  if (isServer) {
    // Return a mock store for server-side rendering
    return {
      getState: () => ({}) as T,
      setState: () => {},
      subscribe: () => () => {},
      persist: {
        rehydrate: () => Promise.resolve(),
        hasHydrated: () => false,
        onHydrate: () => () => {},
        onFinishHydration: () => () => {},
      },
    }
  }
  return storeCreator()
}
```

**Conditional Store Access**

```typescript
// lib/hooks/useServerSafeStore.ts
import { useAuthStore } from '@/lib/stores/auth-store'
import { isServer } from '@/lib/stores/server-safe'

export const useServerSafeAuthStore = () => {
  if (isServer) {
    // Return default values for server-side rendering
    return {
      isAuthenticated: false,
      user: null,
      authKey: null,
      isLoading: false,
      isLoggingIn: false,
      isLoggingOut: false,
      _hasHydrated: false,
      login: () => {},
      logout: () => {},
      setLoading: () => {},
      setLoggingIn: () => {},
      setLoggingOut: () => {},
      setHasHydrated: () => {},
    }
  }
  return useAuthStore()
}
```

### **3. React Query Integration**

#### **Coordinated State Management**

```typescript
// lib/hooks/useAuthWithQuery.ts
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/lib/services/auth'

export function useAuthWithQuery() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  // React Query for user profile
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authService.getUserProfile(),
    enabled: authStore.isAuthenticated,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({
      mobileNumber,
      otp,
    }: {
      mobileNumber: string
      otp: string
    }) => authService.verifyOtp(otp),
    onSuccess: response => {
      // Update Zustand store
      authStore.login(response.authKey, response.user)

      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Zustand store
      authStore.logout()

      // Clear React Query cache
      queryClient.clear()
    },
  })

  return {
    // Zustand state
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    authKey: authStore.authKey,

    // React Query state
    userProfile,
    isLoading: isLoading || loginMutation.isPending,

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  }
}
```

#### **Store Synchronization**

```typescript
// lib/stores/cart-store.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useCartStore = create<CartState>()(
  subscribeWithSelector((set, get) => ({
    items: [],
    total: 0,
    lastUpdated: null,
    expiresAt: null,

    addItem: item => {
      const { items } = get()
      const existingItem = items.find(i => i.id === item.id)

      if (existingItem) {
        set({
          items: items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
          lastUpdated: new Date(),
        })
      } else {
        set({
          items: [...items, item],
          lastUpdated: new Date(),
        })
      }

      // Update total
      get().updateTotal()
    },

    updateTotal: () => {
      const { items } = get()
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      set({ total })
    },

    // ... other actions
  })),
)

// Subscribe to cart changes for React Query invalidation
useCartStore.subscribe(
  state => state.items,
  items => {
    // Invalidate booking-related queries when cart changes
    if (typeof window !== 'undefined') {
      // Only run on client-side
      import('@tanstack/react-query').then(({ useQueryClient }) => {
        const queryClient = useQueryClient()
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
      })
    }
  },
)
```

### **4. Persistence Strategy**

#### **Persistence Configuration**

```typescript
// lib/stores/persistence-config.ts
export const PERSISTENCE_CONFIG = {
  // Auth store - localStorage with encryption
  auth: {
    storage: 'localStorage',
    encrypt: true,
    expireIn: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Settings store - localStorage
  settings: {
    storage: 'localStorage',
    encrypt: false,
    expireIn: null, // No expiration
  },

  // UI store - sessionStorage (temporary)
  ui: {
    storage: 'sessionStorage',
    encrypt: false,
    expireIn: null,
  },

  // Cart store - localStorage with expiration
  cart: {
    storage: 'localStorage',
    encrypt: false,
    expireIn: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Tenant store - localStorage
  tenant: {
    storage: 'localStorage',
    encrypt: false,
    expireIn: null,
  },
}
```

#### **Encrypted Storage**

```typescript
// lib/stores/encrypted-storage.ts
import { StateStorage } from 'zustand/middleware'

export const createEncryptedStorage = (): StateStorage => {
  return {
    getItem: (name: string) => {
      try {
        const encrypted = localStorage.getItem(name)
        if (!encrypted) return null

        // Decrypt data (implement your encryption logic)
        const decrypted = decrypt(encrypted)
        return decrypted
      } catch (error) {
        console.error('Failed to decrypt storage:', error)
        return null
      }
    },

    setItem: (name: string, value: string) => {
      try {
        // Encrypt data (implement your encryption logic)
        const encrypted = encrypt(value)
        localStorage.setItem(name, encrypted)
      } catch (error) {
        console.error('Failed to encrypt storage:', error)
      }
    },

    removeItem: (name: string) => {
      localStorage.removeItem(name)
    },
  }
}

// Simple encryption/decryption (use a proper library in production)
function encrypt(data: string): string {
  return btoa(data) // Base64 encoding (replace with proper encryption)
}

function decrypt(data: string): string {
  return atob(data) // Base64 decoding (replace with proper decryption)
}
```

#### **Store with Persistence**

```typescript
// lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createEncryptedStorage } from './encrypted-storage'
import { PERSISTENCE_CONFIG } from './persistence-config'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => createEncryptedStorage()),
      partialize: state => ({
        // Only persist specific fields
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        authKey: state.authKey,
      }),
      onRehydrateStorage: () => state => {
        // Handle rehydration
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  ),
)
```

### **5. Multi-Tenant Integration**

#### **Tenant-Aware Stores**

```typescript
// lib/stores/tenant-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TenantState {
  currentTenant: TenantContext | null
  tenantHistory: Record<string, TenantContext>
  tenantPreferences: Record<string, TenantPreferences>

  setCurrentTenant: (tenant: TenantContext) => void
  addToHistory: (tenant: TenantContext) => void
  setTenantPreference: (tenantId: string, preference: TenantPreferences) => void
  clearTenantData: (tenantId: string) => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      tenantHistory: {},
      tenantPreferences: {},

      setCurrentTenant: tenant => {
        set({ currentTenant: tenant })
        get().addToHistory(tenant)
      },

      addToHistory: tenant => {
        const { tenantHistory } = get()
        set({
          tenantHistory: {
            ...tenantHistory,
            [tenant.tenantId]: tenant,
          },
        })
      },

      setTenantPreference: (tenantId, preference) => {
        const { tenantPreferences } = get()
        set({
          tenantPreferences: {
            ...tenantPreferences,
            [tenantId]: preference,
          },
        })
      },

      clearTenantData: tenantId => {
        const { tenantHistory, tenantPreferences } = get()
        const newHistory = { ...tenantHistory }
        const newPreferences = { ...tenantPreferences }

        delete newHistory[tenantId]
        delete newPreferences[tenantId]

        set({
          tenantHistory: newHistory,
          tenantPreferences: newPreferences,
        })
      },
    }),
    {
      name: 'tenant-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

#### **Tenant-Specific State**

```typescript
// lib/stores/cart-store.ts
import { useTenantStore } from './tenant-store'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ... cart implementation

      // Tenant-aware actions
      addItem: item => {
        const tenantStore = useTenantStore.getState()
        const currentTenant = tenantStore.currentTenant

        if (currentTenant) {
          // Add tenant context to item
          const tenantItem = {
            ...item,
            tenantId: currentTenant.tenantId,
            addedAt: new Date().toISOString(),
          }

          // ... rest of addItem logic
        }
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => {
        // Only persist items for current tenant
        const tenantStore = useTenantStore.getState()
        const currentTenant = tenantStore.currentTenant

        if (currentTenant) {
          return {
            ...state,
            items: state.items.filter(
              item => item.tenantId === currentTenant.tenantId,
            ),
          }
        }

        return state
      },
    },
  ),
)
```

### **6. Performance Optimization**

#### **Store Selectors**

```typescript
// lib/hooks/useAuthStore.ts
import { useAuthStore } from '@/lib/stores/auth-store'
import { shallow } from 'zustand/shallow'

// Optimized selectors
export const useAuthState = () =>
  useAuthStore(
    state => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      authKey: state.authKey,
    }),
    shallow,
  )

export const useAuthActions = () =>
  useAuthStore(
    state => ({
      login: state.login,
      logout: state.logout,
      setLoading: state.setLoading,
    }),
    shallow,
  )

export const useAuthLoading = () =>
  useAuthStore(
    state => ({
      isLoading: state.isLoading,
      isLoggingIn: state.isLoggingIn,
      isLoggingOut: state.isLoggingOut,
    }),
    shallow,
  )
```

#### **Store Subscription**

```typescript
// lib/stores/subscriptions.ts
import { useAuthStore } from './auth-store'
import { useCartStore } from './cart-store'

// Subscribe to auth changes for cart cleanup
useAuthStore.subscribe(
  state => state.isAuthenticated,
  isAuthenticated => {
    if (!isAuthenticated) {
      // Clear cart when user logs out
      useCartStore.getState().clearCart()
    }
  },
)

// Subscribe to tenant changes for state cleanup
useTenantStore.subscribe(
  state => state.currentTenant,
  (currentTenant, previousTenant) => {
    if (previousTenant && currentTenant?.tenantId !== previousTenant.tenantId) {
      // Clear tenant-specific state when switching tenants
      useCartStore.getState().clearCart()
    }
  },
)
```

## 🚀 Implementation Plan

### **Phase 1: Core Setup**

1. **Install Dependencies**

   ```bash
   npm install zustand zustand/middleware
   ```

2. **Create Store Structure**
   - Set up store directories
   - Create base store types
   - Implement store providers

3. **Basic Store Implementation**
   - Auth store with persistence
   - UI store for modals/toggles
   - Settings store for preferences

### **Phase 2: Integration**

1. **React Query Coordination**
   - Implement coordinated hooks
   - Set up store subscriptions
   - Handle cache invalidation

2. **SSR/SSG Compatibility**
   - Store hydration
   - Server-side considerations
   - Client-side initialization

3. **Multi-Tenant Support**
   - Tenant-aware stores
   - Tenant-specific persistence
   - State isolation

### **Phase 3: Optimization**

1. **Performance Optimization**
   - Store selectors
   - Memoization
   - Bundle optimization

2. **Advanced Features**
   - Encrypted storage
   - State synchronization
   - Debug tools

## 📊 Benefits

### **✅ SSR/SSG Compatibility**

- **Hydration Strategy**: Proper store hydration with `skipHydration: true`
- **Server-Side Safety**: No store access on server with conditional checks
- **Client-Side Initialization**: Smooth client-side startup with loading states
- **Hydration Events**: Proper handling of hydration lifecycle events

### **✅ React Query Integration**

- **Coordinated State**: Seamless server/client state management
- **Cache Synchronization**: Automatic cache invalidation
- **Optimistic Updates**: Coordinated optimistic UI updates

### **✅ Persistence Strategy**

- **Selective Persistence**: Only persist necessary data
- **Encryption**: Secure storage for sensitive data
- **Expiration**: Automatic data cleanup
- **Multi-Tenant**: Tenant-specific persistence

### **✅ Performance**

- **Minimal Re-renders**: Optimized selectors with `shallow` comparison
- **Bundle Size**: Tree-shakable stores
- **Memory Management**: Automatic cleanup

---

## 🎯 Next Steps

1. **Review and Approve**: Review this plan and provide feedback
2. **Implementation**: Start with Phase 1 implementation
3. **Testing**: Comprehensive testing of SSR/SSG scenarios
4. **Documentation**: Update documentation with Zustand patterns
5. **Migration**: Gradually migrate existing state to Zustand

This plan provides a **comprehensive foundation** for Zustand integration that respects your project's architecture and requirements! 🚀
