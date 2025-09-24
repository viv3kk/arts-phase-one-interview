# Type Definitions Guide - Unified Type System

## 🎯 Overview

This guide documents the **unified type system** implemented for the Multi-Tenant Car Rental Storefront project. The type system provides comprehensive type safety, consistent patterns, and enhanced developer experience.

## 📁 Type System Architecture

### **File Structure**

```
lib/types/
├── store.types.ts      # Base interfaces and shared types
├── hooks.types.ts      # Hook return type definitions
└── auth.types.ts       # Domain-specific auth types

lib/stores/
├── store.ts            # Main store factory with type safety
├── slices/
│   ├── auth.slice.ts   # Auth slice with computed properties
│   └── user.slice.ts   # User slice with typed actions
└── types.ts            # Legacy compatibility (deprecated)
```

### **Type Hierarchy**

```
BaseError
├── AuthError (extends BaseError)
└── ServiceError (extends BaseError)

BaseAsyncState
├── BaseSlice (extends BaseAsyncState)
│   ├── AuthState (extends BaseSlice)
│   └── UserState (extends BaseSlice)
└── AsyncResult<T>

HookResult<TData, TActions>
├── AuthHookResult
├── UserHookResult
├── QueryHookResult<TData, TError>
└── MutationHookResult<TData, TVariables, TError>
```

## 🔧 Core Type Definitions

### **Base Types (`lib/types/store.types.ts`)**

#### **BaseError Interface**

```typescript
export interface BaseError {
  code?: string
  message: string
  details?: Record<string, unknown>
  timestamp?: string
}
```

**Purpose**: Provides a consistent error structure across the application.

**Usage**:

```typescript
const error: BaseError = {
  code: 'AUTH_FAILED',
  message: 'Authentication failed',
  details: { userId: '123' },
  timestamp: new Date().toISOString(),
}
```

#### **BaseAsyncState Interface**

```typescript
export interface BaseAsyncState {
  isLoading: boolean
  error: string | null
}
```

**Purpose**: Standardizes loading and error states across all async operations.

**Usage**:

```typescript
const state: BaseAsyncState = {
  isLoading: true,
  error: null,
}
```

#### **BaseSlice Interface**

```typescript
export interface BaseSlice extends BaseAsyncState {
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}
```

**Purpose**: Provides common state management actions for all slices.

**Usage**:

```typescript
const slice: BaseSlice = {
  isLoading: false,
  error: null,
  setLoading: loading => {
    /* implementation */
  },
  setError: error => {
    /* implementation */
  },
  clearError: () => {
    /* implementation */
  },
}
```

#### **Action Creator Type**

```typescript
export type ActionCreator<TArgs extends unknown[] = []> = (
  ...args: TArgs
) => void
```

**Purpose**: Provides type-safe action creators with parameter validation.

**Usage**:

```typescript
const setAuthData: ActionCreator<
  [{ authKey: string; userId: string }]
> = data => {
  /* implementation */
}

// Type-safe call
setAuthData({ authKey: 'abc123', userId: 'user456' })
```

#### **Computed Getter Type**

```typescript
export type ComputedGetter<TResult> = () => TResult
```

**Purpose**: Provides type-safe computed properties with memoization.

**Usage**:

```typescript
const hasValidSession: ComputedGetter<boolean> = () => {
  // Implementation that returns boolean
  return true
}
```

### **Hook Types (`lib/types/hooks.types.ts`)**

#### **AuthHookResult Interface**

```typescript
export interface AuthHookResult extends BaseAsyncState {
  // State
  authKey: string | null
  userId: string | null
  isAuthenticated: boolean
  otpRequestId: string | null

  // Actions
  setAuthData: (data: { authKey: string; userId: string }) => void
  setOtpRequestId: (requestId: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  clearAuth: () => void

  // Computed properties
  hasValidSession: () => boolean
  needsAuthentication: () => boolean
}
```

**Purpose**: Defines the complete interface for the `useAuth` hook.

**Usage**:

```typescript
const auth: AuthHookResult = useAuth()

// Type-safe access
if (auth.hasValidSession()) {
  console.log(`User ${auth.userId} is authenticated`)
}
```

#### **UserHookResult Interface**

```typescript
export interface UserHookResult extends BaseAsyncState {
  // State
  profile: User | null

  // Actions
  setProfile: (profile: User) => void
  updateProfile: (profileData: UserProfileUpdate) => void
  clearProfile: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Computed properties
  needsProfileCompletion: () => boolean
  hasValidProfile: () => boolean
  getUserDisplayName: () => string
}
```

**Purpose**: Defines the complete interface for the `useUser` hook.

**Usage**:

```typescript
const user: UserHookResult = useUser()

// Type-safe operations
if (user.needsProfileCompletion()) {
  return <ProfileCompletionForm />
}

const displayName = user.getUserDisplayName()
```

#### **QueryHookResult Interface**

```typescript
export interface QueryHookResult<TData = unknown, TError = string> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isSuccess: boolean
  isFetching: boolean
  refetch: () => void
  invalidate: () => void
}
```

**Purpose**: Standardizes React Query hook return types.

**Usage**:

```typescript
const query: QueryHookResult<UserProfile> = useQuery({
  queryKey: ['user-profile'],
  queryFn: fetchUserProfile
})

if (query.isLoading) return <Loading />
if (query.error) return <Error message={query.error} />
if (query.data) return <Profile data={query.data} />
```

#### **MutationHookResult Interface**

```typescript
export interface MutationHookResult<
  TData = unknown,
  TVariables = unknown,
  TError = string,
> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isSuccess: boolean
  isPending: boolean
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  reset: () => void
}
```

**Purpose**: Standardizes React Query mutation hook return types.

**Usage**:

```typescript
const mutation: MutationHookResult<UserProfile, LoginCredentials> = useMutation(
  {
    mutationFn: loginUser,
  },
)

const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const result = await mutation.mutateAsync(credentials)
    console.log('Login successful:', result)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### **Domain-Specific Types (`lib/types/auth.types.ts`)**

#### **AuthError Interface**

```typescript
export interface AuthError extends BaseError {
  code:
    | 'INVALID_OTP'
    | 'EXPIRED_OTP'
    | 'INVALID_MOBILE'
    | 'SESSION_EXPIRED'
    | 'UNKNOWN'
  field?: 'mobileNumber' | 'otp' | 'authKey'
}
```

**Purpose**: Provides specific error types for authentication operations.

**Usage**:

```typescript
const authError: AuthError = {
  code: 'INVALID_OTP',
  message: 'Invalid OTP provided',
  field: 'otp',
  timestamp: new Date().toISOString(),
}
```

#### **AuthOperationState Interface**

```typescript
export interface AuthOperationState extends BaseAsyncState {
  session: AuthSession | null
}
```

**Purpose**: Tracks authentication operation state for React Query hooks.

**Usage**:

```typescript
const authState: AuthOperationState = {
  isLoading: false,
  error: null,
  session: {
    authKey: 'abc123',
    userId: 'user456',
    askForName: false,
  },
}
```

## 🎯 Slice Implementation Patterns

### **Auth Slice (`lib/stores/slices/auth.slice.ts`)**

#### **AuthState Interface**

```typescript
export interface AuthState extends BaseSlice {
  // State properties
  authKey: string | null
  userId: string | null
  isAuthenticated: boolean
  otpRequestId: string | null

  // Typed actions
  setAuthData: ActionCreator<[AuthData]>
  setOtpRequestId: ActionCreator<[string | null]>
  clearAuth: ActionCreator<[]>

  // Computed properties
  hasValidSession: ComputedGetter<boolean>
  needsAuthentication: ComputedGetter<boolean>
}
```

#### **AuthData Interface**

```typescript
export interface AuthData {
  authKey: string
  userId: string
}
```

#### **Implementation Example**

```typescript
export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  ...initialAuthState,

  setAuthData: (data: AuthData) =>
    set({
      authKey: data.authKey,
      userId: data.userId,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  hasValidSession: () => {
    const state = get()
    return !!(state.authKey && state.userId && state.isAuthenticated)
  },

  needsAuthentication: () => {
    const state = get()
    return !state.isAuthenticated || !state.authKey
  },
})
```

### **User Slice (`lib/stores/slices/user.slice.ts`)**

#### **User Interface**

```typescript
export interface User {
  id: string
  name: string
  email?: string
  mobileNumber: string
  profileComplete: boolean
  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, unknown>
}
```

#### **UserProfileUpdate Interface**

```typescript
export interface UserProfileUpdate {
  name?: string
  email?: string
  mobileNumber?: string
  profileComplete?: boolean
  metadata?: Record<string, unknown>
}
```

#### **UserState Interface**

```typescript
export interface UserState extends BaseSlice {
  profile: User | null

  setProfile: ActionCreator<[User]>
  updateProfile: ActionCreator<[UserProfileUpdate]>
  clearProfile: ActionCreator<[]>

  needsProfileCompletion: ComputedGetter<boolean>
  hasValidProfile: ComputedGetter<boolean>
  getUserDisplayName: ComputedGetter<string>
}
```

## 🔧 Usage Patterns

### **Basic Hook Usage**

```typescript
import { useAuth, useUser } from '@/lib/providers/StoreProvider'

function MyComponent() {
  const { isAuthenticated, authKey, setAuthData, hasValidSession } = useAuth()

  const { profile, setProfile, getUserDisplayName } = useUser()

  // Type-safe operations
  if (hasValidSession()) {
    console.log(`Welcome, ${getUserDisplayName()}!`)
  }
}
```

### **Error Handling**

```typescript
function LoginForm() {
  const { setAuthData, setError, error, isLoading } = useAuth()

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      setAuthData({
        authKey: response.authKey,
        userId: response.userId
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}
    </form>
  )
}
```

### **Computed Properties**

```typescript
function UserProfile() {
  const {
    profile,
    needsProfileCompletion,
    hasValidProfile
  } = useUser()

  if (needsProfileCompletion()) {
    return <ProfileCompletionForm />
  }

  if (hasValidProfile()) {
    return <UserDashboard />
  }

  return <LoadingSpinner />
}
```

### **Custom Selectors**

```typescript
// Type-safe custom selectors
const useAuthStatus = () => {
  const { isAuthenticated, hasValidSession } = useAuth()
  return {
    isLoggedIn: isAuthenticated,
    hasValidAuth: hasValidSession(),
    needsLogin: !isAuthenticated || !hasValidSession(),
  }
}
```

### **Coordinated State Management**

```typescript
// Combine Zustand with React Query
function useUserProfile() {
  const { userId, isAuthenticated } = useAuth()
  const { setProfile } = useUser()

  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getProfile(userId),
    enabled: isAuthenticated && !!userId,
    onSuccess: data => setProfile(data),
  })
}
```

## 🚀 Migration Guide

### **From Legacy Types**

```typescript
// ❌ Old pattern (deprecated)
import { useAuthState } from '@/lib/hooks/stores/useAuthStore'

// ✅ New pattern
import { useAuth } from '@/lib/providers/StoreProvider'
```

### **From Unstructured State**

```typescript
// ❌ Old pattern
const { authKey, userId, isAuthenticated } = useAuth()
const { setAuthData } = useAuthActions()

// ✅ New pattern
const { authKey, userId, isAuthenticated, setAuthData } = useAuth()
```

### **From Untyped Actions**

```typescript
// ❌ Old pattern
const setAuthData = (data: any) => {
  /* implementation */
}

// ✅ New pattern
const setAuthData: ActionCreator<[AuthData]> = data => {
  /* implementation */
}
```

## 📊 Benefits

### **Type Safety**

- **100% TypeScript coverage** - No `any` types
- **Compile-time validation** - Catch errors before runtime
- **Parameter type checking** - Validated action parameters
- **Return type inference** - Full IntelliSense support

### **Consistency**

- **Shared base interfaces** - Common patterns across slices
- **Standardized error handling** - Unified error types
- **Consistent hook APIs** - Predictable return structures
- **Modular architecture** - Easy to extend and maintain

### **Developer Experience**

- **Autocomplete everywhere** - Better IDE support
- **Clear documentation** - Types as documentation
- **Refactoring safety** - Find usages easily
- **Debugging clarity** - Type information in errors

### **Maintainability**

- **Central type definitions** - Single source of truth
- **Backward compatibility** - Legacy type support
- **Future extensibility** - Generic patterns
- **Documentation comments** - Self-documenting code

## 🎯 Best Practices

### **1. Always Extend Base Types**

```typescript
// ✅ Good
export interface MySlice extends BaseSlice {
  // Custom properties
}

// ❌ Avoid
export interface MySlice {
  // Duplicating base properties
  isLoading: boolean
  error: string | null
}
```

### **2. Use Typed Action Creators**

```typescript
// ✅ Good
const setData: ActionCreator<[MyData]> = data => {
  /* implementation */
}

// ❌ Avoid
const setData = (data: any) => {
  /* implementation */
}
```

### **3. Implement Computed Properties**

```typescript
// ✅ Good
const hasValidData: ComputedGetter<boolean> = () => {
  const state = get()
  return !!(state.data && state.data.isValid)
}

// ❌ Avoid
const hasValidData = () => {
  // Untyped implementation
}
```

### **4. Use Hook Return Types**

```typescript
// ✅ Good
export const useMyHook = (): MyHookResult => {
  // Implementation
}

// ❌ Avoid
export const useMyHook = () => {
  // Untyped return
}
```

### **5. Handle Errors Consistently**

```typescript
// ✅ Good
const handleError = (error: string | null) => {
  setError(error)
  setLoading(false)
}

// ❌ Avoid
const handleError = (error: any) => {
  // Inconsistent error handling
}
```

---

**This type system provides a solid foundation for type-safe, maintainable state management in your multi-tenant car rental application.** 🚀
