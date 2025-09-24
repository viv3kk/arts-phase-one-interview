# Global Authentication Modal System

## Overview

The Global Authentication Modal System provides a comprehensive authentication solution that allows any component to trigger login and execute custom callbacks after successful authentication. This system integrates seamlessly with your existing Zustand store architecture and React Query hooks.

## Architecture Layers

### 1. Zustand Store Layer (Bottom)

- **File**: `lib/stores/slices/auth.slice.ts`
- **Purpose**: Manages modal state, success callbacks, and authentication data
- **Key Features**:
  - Modal open/close state
  - Success callback storage and execution
  - Integration with existing auth state

### 2. React Query Hooks Layer (Server State)

- **File**: `lib/services/hooks/auth-hooks.ts`
- **Purpose**: Manages server-side authentication operations
- **Key Features**:
  - OTP sending and verification
  - Integration with modal success callbacks
  - Server state synchronization

### 3. useAuth Hook Layer (Bridge)

- **File**: `lib/providers/StoreProvider.tsx`
- **Purpose**: Provides unified interface for components
- **Key Features**:
  - Modal state and actions
  - Authentication state and actions
  - Computed properties

### 4. Component Layer (Top)

- **Files**: `components/ui/LoginModal.tsx`, `components/ui/AuthDemo.tsx`
- **Purpose**: User interface and usage examples
- **Key Features**:
  - Global modal component
  - Usage patterns and examples
  - Component migration guide

## Core Features

### Global Modal System

```typescript
// From any component (Point A)
const { openLoginModal } = useAuth()

// Open with custom success callback (Point B)
openLoginModal(() => {
  router.push('/dashboard')
  showToast('Welcome!')
})
```

### Modal Integration with React Query

- LoginModal component uses existing `useSendOtp` and `useVerifyOtp` hooks
- After successful verification, executes stored callback from Zustand store
- Integrates `executeSuccessCallback` into `useVerifyOtp`'s `onSuccess`
- Automatically closes modal and resets state

### Component Migration

- All components must use `useAuth` hook (no direct store access)
- Existing React Query hooks remain unchanged
- Server state management patterns preserved

## Usage Patterns

### Pattern 1: Simple Login with Redirect

```typescript
const { openLoginModal } = useAuth()

const handleLogin = () => {
  openLoginModal(() => {
    router.push('/dashboard')
  })
}
```

### Pattern 2: Login with Multiple Actions

```typescript
const { openLoginModal } = useAuth()

const handleLogin = () => {
  openLoginModal(async () => {
    await router.push('/profile')
    showToast('Welcome back!')
    updateUserPreferences()
  })
}
```

### Pattern 3: Conditional Login

```typescript
const { openLoginModal, hasValidSession } = useAuth()

const handleLogin = () => {
  openLoginModal(() => {
    if (hasValidSession()) {
      router.push('/premium-features')
    } else {
      router.push('/basic-features')
    }
  })
}
```

### Pattern 4: Login with Error Handling

```typescript
const { openLoginModal } = useAuth()

const handleLogin = () => {
  openLoginModal(async () => {
    try {
      await router.push('/secure-area')
      console.log('Successfully accessed secure area')
    } catch (error) {
      console.error('Failed to access secure area:', error)
      // Handle error gracefully
    }
  })
}
```

## Component Migration Guide

### Before (Direct Store Access)

```typescript
// ❌ OLD: Direct store access
import { useAuthStore } from '@/lib/stores/auth-store'

function MyComponent() {
  const { isAuthenticated, user } = useAuthStore()
  // ... component logic
}
```

### After (useAuth Hook)

```typescript
// ✅ NEW: Use useAuth hook
import { useAuth } from '@/lib/providers/StoreProvider'

function MyComponent() {
  const { isAuthenticated, profile } = useAuth()
  // ... component logic
}
```

## API Reference

### useAuth Hook

#### State Properties

```typescript
interface AuthHookResult {
  // Auth state
  authKey: string | null
  userId: string | null
  isAuthenticated: boolean
  otpRequestId: string | null

  // Modal state
  isModalOpen: boolean
  onSuccessCallback: (() => void | Promise<void>) | null

  // Loading and error states
  isLoading: boolean
  error: string | null
}
```

#### Actions

```typescript
interface AuthHookResult {
  // Auth actions
  setAuthData: (data: { authKey: string; userId: string }) => void
  setOtpRequestId: (requestId: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  clearAuth: () => void

  // Modal actions
  openLoginModal: (callback?: () => void | Promise<void>) => void
  closeLoginModal: () => void
  setSuccessCallback: (callback: (() => void | Promise<void>) | null) => void
  executeSuccessCallback: () => void
}
```

#### Computed Properties

```typescript
interface AuthHookResult {
  // Computed properties
  hasValidSession: () => boolean
  needsAuthentication: () => boolean
}
```

### LoginModal Component

#### Props

```typescript
interface LoginModalProps {
  className?: string // Optional custom styling
}
```

#### Features

- Automatically integrates with `useAuth` hook
- Uses existing React Query hooks (`useSendOtp`, `useVerifyOtp`)
- Handles mobile number input and OTP verification
- Displays errors from both auth state and mutations
- Responsive design with loading states

## Integration with Existing Code

### React Query Hooks

The existing React Query hooks remain unchanged but now integrate with the modal system:

```typescript
// useVerifyOtp automatically executes success callback
export function useVerifyOtp() {
  const { executeSuccessCallback } = useAuth()

  return useMutation({
    // ... existing configuration
    onSuccess: async (response: OtpVerifyResponse) => {
      // ... existing logic

      // Execute success callback if modal was opened with one
      await executeSuccessCallback()

      // ... rest of existing logic
    },
  })
}
```

### Zustand Store

The auth slice extends existing functionality:

```typescript
export interface AuthState extends BaseSlice {
  // ... existing properties

  // New modal properties
  isModalOpen: boolean
  onSuccessCallback: AuthSuccessCallback | null

  // New modal actions
  openLoginModal: ActionCreator<[AuthSuccessCallback?]>
  closeLoginModal: ActionCreator<[]>
  setSuccessCallback: ActionCreator<[AuthSuccessCallback | null]>
  executeSuccessCallback: ActionCreator<[]>
}
```

## Best Practices

### 1. Always Use useAuth Hook

- Never access the store directly
- Use the hook for all authentication operations
- Leverage computed properties for derived state

### 2. Handle Callbacks Properly

- Make callbacks async when possible
- Include error handling in callbacks
- Keep callbacks focused and lightweight

### 3. Modal State Management

- Let the modal system handle its own state
- Don't manually manipulate modal state
- Use success callbacks for post-authentication actions

### 4. Error Handling

- Errors are automatically displayed in the modal
- Use try-catch in callbacks for complex operations
- Leverage existing error states from the store

## Testing

### Unit Tests

- Test individual hooks and actions
- Mock React Query mutations
- Verify callback execution

### Integration Tests

- Test modal open/close flow
- Test OTP verification flow
- Test callback execution after success

### E2E Tests

- Test complete authentication flow
- Test modal integration
- Test callback execution

## Troubleshooting

### Common Issues

#### Modal Not Opening

- Check if `useAuth` is used within `StoreProvider`
- Verify `openLoginModal` is called correctly
- Check for console errors

#### Callback Not Executing

- Ensure callback is passed to `openLoginModal`
- Check if OTP verification succeeds
- Verify no errors in verification process

#### Type Errors

- Ensure all imports are correct
- Check TypeScript configuration
- Verify interface compatibility

### Debug Mode

Enable debug logging in development:

```typescript
// In StoreProvider.tsx
useEffect(() => {
  if (process.env.NODE_ENV !== 'production' && storeRef.current) {
    const unsubscribe = storeRef.current.subscribe(state => {
      console.log('Store state changed:', state)
    })
    return () => unsubscribe()
  }
}, [])
```

## Performance Considerations

### useShallow Optimization

The `useAuth` hook uses `useShallow` to prevent unnecessary re-renders:

```typescript
return useStore(
  store,
  useShallow(state => ({
    // ... selector
  })),
)
```

### Memoization

- Callbacks are stored in Zustand state
- Modal state changes are optimized
- Loading states are consolidated

## Future Enhancements

### Planned Features

- Multiple authentication methods
- Social login integration
- Two-factor authentication
- Session management
- Offline support

### Extension Points

- Custom modal themes
- Additional callback types
- Integration with routing libraries
- Analytics and tracking

## Conclusion

The Global Authentication Modal System provides a robust, scalable solution for authentication needs while maintaining compatibility with your existing architecture. By following the established patterns and using the provided hooks, you can easily implement authentication flows throughout your application.

For questions or issues, refer to the component examples in `AuthDemo.tsx` and the implementation details in the source files.
