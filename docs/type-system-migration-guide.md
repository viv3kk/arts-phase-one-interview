# Type System Migration Guide

## 🚀 Migrating to the New Type System

This guide helps developers migrate from the legacy type system to the new unified type system with enhanced type safety and consistency.

## 📋 Migration Overview

### **What Changed**

- ✅ **Unified type definitions** - Centralized in `lib/types/`
- ✅ **Enhanced type safety** - 100% TypeScript coverage
- ✅ **Standardized patterns** - Consistent interfaces across slices
- ✅ **Better developer experience** - Full IntelliSense support
- ✅ **Computed properties** - Type-safe computed getters
- ✅ **Action creators** - Typed action creators with parameter validation

### **What's Deprecated**

- ❌ **Legacy type files** - `lib/stores/types.ts` (kept for compatibility)
- ❌ **Unstructured state** - Untyped action creators
- ❌ **Inconsistent patterns** - Different error handling approaches
- ❌ **Manual type casting** - `as any` usage

## 🔄 Migration Steps

### **Step 1: Update Imports**

#### **Before (Legacy)**

```typescript
// ❌ Old imports
import { useAuthState } from '@/lib/hooks/stores/useAuthStore'
import { useAuthActions } from '@/lib/hooks/stores/useAuthStore'
import { AuthState } from '@/lib/stores/types'
```

#### **After (New)**

```typescript
// ✅ New imports
import { useAuth } from '@/lib/providers/StoreProvider'
import type { AuthHookResult } from '@/lib/types/hooks.types'
import type { AuthState } from '@/lib/stores/slices/auth.slice'
```

### **Step 2: Update Hook Usage**

#### **Before (Legacy)**

```typescript
// ❌ Old pattern - multiple hooks
function MyComponent() {
  const { isAuthenticated, authKey } = useAuthState()
  const { setAuthData, clearAuth } = useAuthActions()
  const { isLoading, error } = useAuthLoading()

  const handleLogin = (data: any) => {
    setAuthData(data) // Untyped
  }
}
```

#### **After (New)**

```typescript
// ✅ New pattern - single hook
function MyComponent() {
  const { isAuthenticated, authKey, setAuthData, clearAuth, isLoading, error } =
    useAuth()

  const handleLogin = (data: { authKey: string; userId: string }) => {
    setAuthData(data) // Type-safe
  }
}
```

### **Step 3: Update Error Handling**

#### **Before (Legacy)**

```typescript
// ❌ Old pattern - inconsistent error types
interface AuthState {
  error: any // Untyped
}

const setError = (error: any) => {
  // Inconsistent error handling
}
```

#### **After (New)**

```typescript
// ✅ New pattern - unified error types
interface AuthState extends BaseSlice {
  error: string | null // Consistent error type
}

const setError: ActionCreator<[string | null]> = error => {
  // Consistent error handling
}
```

### **Step 4: Update Action Creators**

#### **Before (Legacy)**

```typescript
// ❌ Old pattern - untyped actions
const setAuthData = (data: any) => {
  set({ authKey: data.authKey, userId: data.userId })
}

const setOtpRequestId = (requestId: any) => {
  set({ otpRequestId: requestId })
}
```

#### **After (New)**

```typescript
// ✅ New pattern - typed actions
const setAuthData: ActionCreator<[AuthData]> = data => {
  set({ authKey: data.authKey, userId: data.userId })
}

const setOtpRequestId: ActionCreator<[string | null]> = requestId => {
  set({ otpRequestId: requestId })
}
```

### **Step 5: Update Computed Properties**

#### **Before (Legacy)**

```typescript
// ❌ Old pattern - manual computation
const useAuthStatus = () => {
  const { isAuthenticated, authKey } = useAuth()
  return {
    hasValidSession: isAuthenticated && !!authKey,
    needsLogin: !isAuthenticated || !authKey,
  }
}
```

#### **After (New)**

```typescript
// ✅ New pattern - computed properties
const { hasValidSession, needsAuthentication } = useAuth()

// Use computed properties directly
if (hasValidSession()) {
  // User has valid session
}

if (needsAuthentication()) {
  // User needs to authenticate
}
```

## 🔧 Code Examples

### **Component Migration**

#### **Before (Legacy Component)**

```typescript
// ❌ Legacy component
'use client'

import { useAuthState, useAuthActions } from '@/lib/hooks/stores/useAuthStore'
import { useUserState, useUserActions } from '@/lib/hooks/stores/useUserStore'

export function UserProfile() {
  const { isAuthenticated, authKey } = useAuthState()
  const { setAuthData, clearAuth } = useAuthActions()
  const { profile } = useUserState()
  const { setProfile } = useUserActions()

  const handleLogin = async (credentials: any) => {
    try {
      const response = await authService.login(credentials)
      setAuthData(response) // Untyped
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    clearAuth()
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div>
      <h1>Welcome, {profile?.name || 'User'}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

#### **After (New Component)**

```typescript
// ✅ New component
'use client'

import { useAuth, useUser } from '@/lib/providers/StoreProvider'
import type { LoginCredentials } from '@/lib/types/auth.types'

export function UserProfile() {
  const {
    isAuthenticated,
    setAuthData,
    clearAuth,
    hasValidSession
  } = useAuth()

  const {
    profile,
    getUserDisplayName
  } = useUser()

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      setAuthData({
        authKey: response.authKey,
        userId: response.userId
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = () => {
    clearAuth()
  }

  if (!hasValidSession()) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div>
      <h1>Welcome, {getUserDisplayName()}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### **Custom Hook Migration**

#### **Before (Legacy Custom Hook)**

```typescript
// ❌ Legacy custom hook
export function useAuthStatus() {
  const { isAuthenticated, authKey } = useAuthState()
  const { profile } = useUserState()

  return {
    isLoggedIn: isAuthenticated && !!authKey,
    hasProfile: !!profile,
    needsProfileCompletion: !!profile && !profile.profileComplete,
    displayName: profile?.name || 'Guest',
  }
}
```

#### **After (New Custom Hook)**

```typescript
// ✅ New custom hook
export function useAuthStatus() {
  const { isAuthenticated, hasValidSession, needsAuthentication } = useAuth()

  const {
    profile,
    hasValidProfile,
    needsProfileCompletion,
    getUserDisplayName,
  } = useUser()

  return {
    isLoggedIn: hasValidSession(),
    hasProfile: !!profile,
    needsProfileCompletion: needsProfileCompletion(),
    displayName: getUserDisplayName(),
    needsLogin: needsAuthentication(),
  }
}
```

## 🚨 Breaking Changes

### **1. Hook Return Types**

#### **Before**

```typescript
// ❌ Old return type
const auth = useAuth() // Untyped return
```

#### **After**

```typescript
// ✅ New return type
const auth: AuthHookResult = useAuth() // Fully typed
```

### **2. Action Parameters**

#### **Before**

```typescript
// ❌ Old action call
setAuthData({ authKey: 'abc', userId: '123' }) // Untyped
```

#### **After**

```typescript
// ✅ New action call
setAuthData({ authKey: 'abc', userId: '123' }) // Type-safe
```

### **3. Error Handling**

#### **Before**

```typescript
// ❌ Old error handling
setError({ code: 'AUTH_FAILED', message: 'Failed' }) // Complex error object
```

#### **After**

```typescript
// ✅ New error handling
setError('Authentication failed') // Simple string
```

## 🔍 Migration Checklist

### **✅ Import Updates**

- [ ] Update all hook imports to use `@/lib/providers/StoreProvider`
- [ ] Remove imports from deprecated files
- [ ] Add type imports from `@/lib/types/`

### **✅ Hook Usage**

- [ ] Replace multiple hook calls with single hook calls
- [ ] Update destructuring patterns
- [ ] Remove unused hook imports

### **✅ Type Safety**

- [ ] Add proper type annotations
- [ ] Remove `any` types
- [ ] Use typed action creators

### **✅ Error Handling**

- [ ] Update error types to use `string | null`
- [ ] Simplify error handling patterns
- [ ] Use consistent error messages

### **✅ Computed Properties**

- [ ] Replace manual computations with computed properties
- [ ] Use `hasValidSession()` instead of manual checks
- [ ] Use `getUserDisplayName()` instead of manual name logic

### **✅ Testing**

- [ ] Update test files to use new patterns
- [ ] Verify type safety in tests
- [ ] Test computed properties

## 🛠️ Migration Tools

### **TypeScript Compiler**

Run the TypeScript compiler to identify migration issues:

```bash
npx tsc --noEmit
```

### **ESLint Rules**

Add ESLint rules to enforce new patterns:

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### **Search and Replace**

Use search and replace to update imports:

```bash
# Find old imports
grep -r "useAuthState" src/
grep -r "useAuthActions" src/

# Replace with new imports
find src/ -name "*.tsx" -exec sed -i 's/useAuthState/useAuth/g' {} \;
```

## 🎯 Benefits After Migration

### **Type Safety**

- ✅ **100% TypeScript coverage** - No `any` types
- ✅ **Compile-time validation** - Catch errors early
- ✅ **Parameter validation** - Type-safe action calls
- ✅ **Return type inference** - Full IntelliSense

### **Developer Experience**

- ✅ **Better autocomplete** - Full IntelliSense support
- ✅ **Refactoring safety** - Automatic type checking
- ✅ **Clear documentation** - Types as documentation
- ✅ **Debugging clarity** - Type information in errors

### **Maintainability**

- ✅ **Consistent patterns** - Standardized interfaces
- ✅ **Central type definitions** - Single source of truth
- ✅ **Modular architecture** - Easy to extend
- ✅ **Future-proof design** - Generic patterns

## 🚀 Post-Migration Steps

### **1. Verify Type Safety**

```bash
npx tsc --noEmit
```

### **2. Run Tests**

```bash
npm test
```

### **3. Build Application**

```bash
npm run build
```

### **4. Update Documentation**

- Update component documentation
- Update API documentation
- Update team guidelines

### **5. Team Training**

- Share migration guide with team
- Conduct code review sessions
- Establish new coding standards

---

**This migration guide ensures a smooth transition to the new type system while maintaining code quality and developer productivity.** 🚀
