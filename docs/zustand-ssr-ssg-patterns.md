# Zustand SSR/SSG Patterns for Next.js App Router

## 📋 Overview

This document provides specific patterns for implementing Zustand with SSR/SSG compatibility in Next.js App Router, based on the [official Zustand documentation](https://zustand.docs.pmnd.rs/integrations/persisting-store-data#usage-in-next.js).

## 🎯 Key SSR/SSG Considerations

### **1. Hydration Mismatch Prevention**

The main challenge with Zustand in SSR/SSG is preventing hydration mismatches between server and client state.

**Problem**: Server renders with initial state, client hydrates with persisted state → mismatch.

**Solution**: Use `skipHydration: true` and manual rehydration.

### **2. Server-Side Safety**

Zustand stores should never be accessed during server-side rendering.

**Problem**: Server tries to access localStorage → error.

**Solution**: Conditional checks and server-safe patterns.

## 🏗️ Implementation Patterns

### **Pattern 1: Manual Hydration with skipHydration**

```typescript
// lib/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  authKey: string | null
  _hasHydrated: boolean

  // Actions
  login: (authKey: string, user: User) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      authKey: null,
      _hasHydrated: false,

      // Actions
      login: (authKey, user) =>
        set({
          isAuthenticated: true,
          user,
          authKey,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          authKey: null,
        }),

      setHasHydrated: state => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // ⭐ Key: Manual hydration
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

### **Pattern 2: Store Provider with Manual Rehydration**

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
    // ⭐ Manual rehydration after component mounts
    const hydrateStores = async () => {
      try {
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

### **Pattern 3: Custom Hydration Hook**

```typescript
// lib/hooks/useHydration.ts
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // ⭐ Subscribe to hydration events
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

### **Pattern 4: Component Usage with Hydration Check**

```typescript
// components/AuthComponent.tsx
'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useHydration } from '@/lib/hooks/useHydration'

export function AuthComponent() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const hasHydrated = useHydration()

  // ⭐ Show loading until hydration is complete
  if (!hasHydrated || !_hasHydrated) {
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

### **Pattern 5: Server-Safe Store Access**

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

### **Pattern 6: Conditional Store Access**

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
      _hasHydrated: false,
      login: () => {},
      logout: () => {},
      setHasHydrated: () => {},
    }
  }
  return useAuthStore()
}
```

## 🚀 App Layout Integration

### **Root Layout with Store Provider**

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

### **Page Component with Hydration Check**

```typescript
// app/page.tsx
'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useHydration } from '@/lib/hooks/useHydration'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const hasHydrated = useHydration()

  // Show loading until hydration is complete
  if (!hasHydrated) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Welcome to Car Rental</h1>
      {isAuthenticated ? (
        <p>Hello, {user?.name}!</p>
      ) : (
        <p>Please log in to continue</p>
      )}
    </div>
  )
}
```

## 🔧 Advanced Patterns

### **Pattern 7: Store with Hydration State**

```typescript
// lib/stores/auth-store.ts
interface AuthState {
  // ... existing state
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... existing implementation
      _hasHydrated: false,
      setHasHydrated: state => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  ),
)
```

### **Pattern 8: Multiple Store Hydration**

```typescript
// lib/providers/StoreProvider.tsx
export function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const hydrateStores = async () => {
      try {
        // Hydrate all stores in parallel
        await Promise.all([
          useAuthStore.persist.rehydrate(),
          useUIStore.persist.rehydrate(),
          useSettingsStore.persist.rehydrate(),
          useCartStore.persist.rehydrate(),
        ])
        setIsHydrated(true)
      } catch (error) {
        console.error('Failed to hydrate stores:', error)
        setIsHydrated(true)
      }
    }

    hydrateStores()
  }, [])

  if (!isHydrated) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}
```

### **Pattern 9: Error Boundary for Hydration**

```typescript
// components/HydrationErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Hydration error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 🧪 Testing SSR/SSG Patterns

### **Test Hydration**

```typescript
// __tests__/hydration.test.tsx
import { render, screen } from '@testing-library/react'
import { StoreProvider } from '@/lib/providers/StoreProvider'
import { AuthComponent } from '@/components/AuthComponent'

describe('Hydration', () => {
  it('shows loading state before hydration', () => {
    render(
      <StoreProvider>
        <AuthComponent />
      </StoreProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows content after hydration', async () => {
    render(
      <StoreProvider>
        <AuthComponent />
      </StoreProvider>
    )

    // Wait for hydration to complete
    await screen.findByText('Please log in')

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
```

### **Test Server-Side Rendering**

```typescript
// __tests__/ssr.test.tsx
import { renderToString } from 'react-dom/server'
import { StoreProvider } from '@/lib/providers/StoreProvider'
import { AuthComponent } from '@/components/AuthComponent'

describe('SSR', () => {
  it('renders without errors on server', () => {
    const html = renderToString(
      <StoreProvider>
        <AuthComponent />
      </StoreProvider>
    )

    expect(html).toContain('Loading...')
    expect(html).not.toContain('localStorage')
  })
})
```

## 🚨 Common Issues & Solutions

### **Issue: Hydration Mismatch**

**Problem**: Server renders one state, client renders different state.

**Solution**:

```typescript
{
  name: 'auth-store',
  storage: createJSONStorage(() => localStorage),
  skipHydration: true, // ⭐ Handle manually
}
```

### **Issue: Server-Side localStorage Access**

**Problem**: Server tries to access localStorage.

**Solution**:

```typescript
const isServer = typeof window === 'undefined'

if (!isServer) {
  // Only access localStorage on client
  localStorage.getItem('key')
}
```

### **Issue: Store Not Hydrating**

**Problem**: Store state not persisting between page loads.

**Solution**:

```typescript
useEffect(() => {
  // ⭐ Manual rehydration
  useAuthStore.persist.rehydrate()
}, [])
```

### **Issue: Multiple Hydration Calls**

**Problem**: Store hydrating multiple times.

**Solution**:

```typescript
const [isHydrated, setIsHydrated] = useState(false)

useEffect(() => {
  if (!isHydrated) {
    useAuthStore.persist.rehydrate()
    setIsHydrated(true)
  }
}, [isHydrated])
```

## 📊 Performance Considerations

### **Bundle Size Optimization**

```typescript
// Only import stores when needed
const useAuthStore = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return require('@/lib/stores/auth-store').useAuthStore()
}
```

### **Selective Persistence**

```typescript
{
  partialize: (state) => ({
    // Only persist essential data
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    authKey: state.authKey,
  }),
}
```

### **Lazy Store Loading**

```typescript
// lib/stores/lazy.ts
export const useLazyAuthStore = () => {
  const [store, setStore] = useState(null)

  useEffect(() => {
    import('./auth-store').then(({ useAuthStore }) => {
      setStore(useAuthStore)
    })
  }, [])

  return store
}
```

## ✅ Best Practices

### **1. Always Use skipHydration for SSR**

```typescript
{
  skipHydration: true, // Required for SSR
}
```

### **2. Check Hydration State**

```typescript
const hasHydrated = useHydration()
if (!hasHydrated) return <Loading />
```

### **3. Server-Safe Access**

```typescript
if (typeof window === 'undefined') {
  // Server-side fallback
  return defaultValue
}
```

### **4. Error Boundaries**

```typescript
<HydrationErrorBoundary>
  <StoreProvider>
    <App />
  </StoreProvider>
</HydrationErrorBoundary>
```

### **5. Testing**

```typescript
// Test both server and client rendering
describe('SSR/SSG', () => {
  it('renders on server', () => {
    /* ... */
  })
  it('hydrates on client', () => {
    /* ... */
  })
})
```

---

## 🎯 Summary

These patterns ensure Zustand works seamlessly with Next.js App Router's SSR/SSG features:

- ✅ **No Hydration Mismatches**: Manual hydration with `skipHydration: true`
- ✅ **Server-Side Safety**: Conditional checks and server-safe patterns
- ✅ **Performance**: Optimized bundle size and selective persistence
- ✅ **Error Handling**: Proper error boundaries and fallbacks
- ✅ **Testing**: Comprehensive SSR/SSG testing

This approach follows the [official Zustand documentation](https://zustand.docs.pmnd.rs/integrations/persisting-store-data#usage-in-next.js) and ensures your multi-tenant car rental storefront works perfectly with Next.js App Router! 🚀
