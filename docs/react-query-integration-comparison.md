# React Query Integration: Storefront vs Host-Consumer-Website

## 📊 **Comprehensive Comparison Analysis**

After analyzing the React Query integration from `host-consumer-website` and comparing it with our current `storefront` implementation, here are the key findings and recommendations.

---

## 🏗️ **Provider Architecture**

### **Host-Consumer-Website** ✅ **Better**

```typescript
// lib/providers/Providers.tsx
export function Providers({ children, initialState }: ProvidersProps) {
  return (
    <StoreProvider initialState={initialState}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </StoreProvider>
  )
}

// lib/providers/QueryClientProvider.tsx - Simple wrapper
export function QueryClientProvider({ children }: QueryClientProviderProps) {
  const [queryClient] = useState(createQueryClient)
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}
```

### **Current Storefront** ❌ **Over-engineered**

```typescript
// We have separate QueryProvider with devtools integration
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

**🎯 Issue**: We're including devtools in the provider when host-consumer doesn't, and our provider structure is more complex.

---

## ⚙️ **QueryClient Configuration**

### **Host-Consumer-Website** ✅ **Simpler & Better**

```typescript
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false, // Better for SSR
        refetchOnWindowFocus: false, // Less aggressive
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1, // Simple retry logic
      },
    },
  })
}
```

### **Current Storefront** ❌ **Over-configured**

```typescript
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute (too short)
        gcTime: 10 * 60 * 1000, // 10 minutes (same)
        retry: (failureCount, error: any) => {
          // Complex retry logic
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false, // Same
        refetchOnMount: true, // More aggressive than host-consumer
        refetchOnReconnect: true, // More aggressive
      },
      mutations: {
        retry: 1,
        onError: error => {
          // Global error handling
          console.error('Mutation error:', error)
        },
      },
    },
  })
}
```

**🎯 Issues**:

- Complex retry logic when simple `retry: 1` works fine
- Too aggressive refetching (`refetchOnMount: true`)
- Shorter staleTime (1 min vs 5 min)
- Global mutation error handler (host-consumer handles errors in hooks)

---

## 🔗 **React Query + Zustand Coordination**

### **Host-Consumer-Website** ✅ **Clean & Direct**

```typescript
export function useAuth() {
  // Direct selector access
  const isAuthenticated = useAppStore(
    (state: StoreState) => state.isAuthenticated,
  )
  const setAuthData = useAppStore((state: StoreState) => state.setAuthData)
  const clearAuth = useAppStore((state: StoreState) => state.clearAuth)

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ otpRequestId, otp }) => {
      // Zustand loading states handled in mutationFn
      setLoading(true)
      try {
        return await authService.verifyOtp(otpRequestId, otp)
      } finally {
        setLoading(false)
      }
    },
    onSuccess: data => {
      setAuthData(data) // Direct Zustand update
      setError(null)
      // React Query invalidation
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
    },
  })
}
```

### **Current Storefront** ❌ **Over-abstracted**

```typescript
export function useVerifyOtp() {
  const { setAuthData, setLoggingIn, setOtpRequestId, setError } = useAuthActions()
  const { setProfile } = useUserActions()
  const { invalidateQueries } = useStoreCoordination()  // Extra abstraction layer

  return useMutation({
    onMutate: () => {
      setLoggingIn(true)  // Separate loading states
      setError(null)
    },
    onSuccess: (response: OtpVerifyResponse) => {
      // More complex coordination logic
      setAuthData({ authKey: response.authKey, userId: response.userId })
      if (!response.askForName) {
        setProfile({...})  // Complex profile setting
      }
      invalidateQueries(['auth', 'profile'])  // Abstracted invalidation
    },
    onSettled: () => {
      setLoggingIn(false)
    },
  })
}
```

**🎯 Issues**:

- Over-abstracted with `useStoreCoordination` hook
- Complex loading state management (`setLoggingIn` vs simple `setLoading`)
- Separate profile management when auth handles it in host-consumer
- More complex coordination patterns

---

## 🎯 **Error Handling Patterns**

### **Host-Consumer-Website** ✅ **Consistent**

```typescript
// Error handling in mutationFn with try/catch
mutationFn: async ({ otpRequestId, otp }) => {
  setLoading(true)
  setError(null)
  try {
    return await authService.verifyOtp(otpRequestId, otp)
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : 'Failed to verify OTP. Please try again.'
    setError(message)
    throw error // Re-throw for React Query
  } finally {
    setLoading(false)
  }
}
```

### **Current Storefront** ❌ **Mixed Patterns**

```typescript
// Global mutation error handler + individual onError callbacks
// More complex but less consistent error handling
```

---

## 📈 **Query Key Patterns**

### **Host-Consumer-Website** ✅ **Simple & Consistent**

```typescript
// Simple query keys
export const AUTH_QUERY_KEYS = {
  profile: ['user', 'profile'],
}

// Usage
queryKey: ['user', 'profile']
queryKey: AUTH_QUERY_KEYS.profile
```

### **Current Storefront** ✅ **Good (Similar)**

```typescript
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}
```

**✅ Both patterns work well**, host-consumer is simpler, ours is more structured.

---

## 🔄 **Hydration & SSR Handling**

### **Host-Consumer-Website** ✅ **Consistent**

```typescript
// Same hydration pattern as ours
useEffect(() => {
  const handleHydration = async () => {
    if (storeRef.current && typeof window !== 'undefined') {
      try {
        await storeRef.current.persist.rehydrate()
        if (state.isLoading) {
          storeRef.current.setState({ isLoading: false })
        }
      } catch (error) {
        console.error('Failed to rehydrate store:', error)
        storeRef.current.setState({ isLoading: false })
      }
    }
  }
}, [])
```

**✅ Both implementations are identical** - our slice-based refactor aligned perfectly!

---

## 🛠️ **DevTools Integration**

### **Host-Consumer-Website** ✅ **Minimal**

- Has `@tanstack/react-query-devtools` in dependencies
- **Does NOT include devtools in the provider**
- Likely uses external devtools or browser extension

### **Current Storefront** ❌ **Built-in**

- Includes devtools directly in provider
- Adds unnecessary bundle size in development builds

---

## 🚨 **Key Issues in Our Implementation**

### **1. Over-engineered Provider Structure**

```typescript
// Current: Too complex
<StoreProvider>
  <QueryProvider>  {/* Separate provider with devtools */}
    <TenantProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TenantProvider>
  </QueryProvider>
</StoreProvider>

// Host-Consumer: Simple
<StoreProvider>
  <QueryClientProvider>{children}</QueryClientProvider>  {/* Just React Query */}
</StoreProvider>
```

### **2. Over-abstracted Coordination**

```typescript
// Our over-abstraction
const { invalidateQueries } = useStoreCoordination()
invalidateQueries(['auth', 'profile'])

// Host-Consumer: Direct
queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
```

### **3. Complex Configuration vs Simple**

```typescript
// Ours: Complex retry logic
retry: (failureCount, error: any) => {
  if (error?.status >= 400 && error?.status < 500) return false
  return failureCount < 3
}

// Host-Consumer: Simple
retry: 1
```

### **4. Too Many Loading States**

```typescript
// Ours: Multiple loading states
;(isLoading, isLoggingIn, isLoggingOut, isLoadingProfile)

// Host-Consumer: Simple loading
isLoading: sendOtpMutation.isPending ||
  verifyOtpMutation.isPending ||
  userProfileQuery.isLoading
```

---

## 🎯 **Recommended Changes**

### **1. Simplify Provider Structure**

```typescript
// lib/providers/Providers.tsx
export function Providers({ children, initialState }) {
  return (
    <StoreProvider initialState={initialState}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </StoreProvider>
  )
}

// lib/providers/QueryClientProvider.tsx
export function QueryClientProvider({ children }) {
  const [queryClient] = useState(createQueryClient)
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}
```

### **2. Simplify QueryClient Configuration**

```typescript
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false, // Match host-consumer
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes (match host-consumer)
        gcTime: 10 * 60 * 1000,
        retry: 1, // Simple retry (match host-consumer)
      },
    },
  })
}
```

### **3. Remove DevTools from Provider**

```typescript
// Remove ReactQueryDevtools from provider
// Use browser extension or external devtools instead
```

### **4. Simplify Coordination Patterns**

```typescript
// Remove useStoreCoordination abstraction
// Use queryClient directly in hooks like host-consumer does
const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
```

### **5. Consolidate Loading States**

```typescript
// Follow host-consumer pattern of combined loading states
isLoading: mutation1.isPending || mutation2.isPending || query.isLoading
```

---

## ✅ **Action Items**

1. **✅ KEEP**: Slice-based Zustand architecture (perfectly aligned with host-consumer)
2. **🔄 SIMPLIFY**: Provider structure to match host-consumer
3. **🔄 SIMPLIFY**: QueryClient configuration (less aggressive, simpler retry)
4. **❌ REMOVE**: Built-in ReactQueryDevtools
5. **🔄 SIMPLIFY**: Remove `useStoreCoordination` abstraction
6. **🔄 CONSOLIDATE**: Loading states to single `isLoading` pattern
7. **🔄 ALIGN**: Error handling patterns to match host-consumer

---

## 🎉 **Summary**

The **host-consumer-website implementation is significantly simpler and cleaner** than our current storefront implementation. Our slice-based Zustand refactor already aligned us perfectly with their store patterns, but our React Query integration is **over-engineered**.

### **Key Learnings:**

1. **✅ Simplicity wins** - Host-consumer proves less abstraction = better maintainability
2. **✅ Direct patterns** - Don't abstract what doesn't need abstraction
3. **✅ Conservative defaults** - Less aggressive refetching, longer stale times
4. **✅ Minimal providers** - Don't include what can be external (devtools)

**Next step**: Adopt the simplified React Query patterns from host-consumer-website! 🚀
