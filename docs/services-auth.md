# Authentication System

This directory contains the complete authentication system for the multi-tenant car rental platform.

## ✅ Implemented Components

### 1. Token Management (`token-manager.ts`)

- **JWT Token Storage**: HTTP-only cookies for secure token storage
- **Automatic Token Refresh**: Background refresh before expiration
- **Token Validation**: JWT decode and expiry checking
- **Secure Cookie Handling**: SameSite, Secure, HttpOnly flags

### 2. Authentication State (`auth-state.ts`)

- **Reactive State Management**: Observable authentication state
- **Automatic Refresh Scheduling**: Proactive token refresh
- **User Session Tracking**: Login/logout state management
- **Permission & Role Checking**: Authorization utilities

### 3. Authentication Interceptors (`auth-interceptor.ts`)

- **Automatic Token Injection**: Bearer token in API requests
- **401/403 Error Handling**: Authentication error processing
- **Token Refresh on 401**: Automatic retry with fresh token
- **Permission Validation**: Request-level authorization

### 4. React Hooks (`hooks.ts`)

- **useAuth**: Complete authentication state and actions
- **useAuthStatus**: Lightweight authentication status
- **useCurrentUser**: Current user information
- **usePermissions**: Permission and role checking
- **useSession**: Session management utilities
- **withAuth**: HOC for protected components

### 5. Authentication Service (`auth-service.ts`)

- **Login/Logout**: Email/password and OTP authentication
- **Token Management**: Centralized token operations
- **Session Validation**: Server-side session checking
- **Multi-tenant Support**: Tenant-aware authentication

### 6. Server-side Utilities (`server.ts`)

- **Server Component Auth**: Next.js server-side authentication
- **Cookie Access**: Server-side token retrieval
- **Protected Routes**: Server-side route protection
- **API Integration**: Authenticated server-side requests

## 🚀 Usage Examples

### Client-side Authentication

```typescript
import { useAuth } from '@/lib/services/auth';

function LoginComponent() {
  const { login, logout, isAuthenticated, user, isLoading } = useAuth();

  const handleLogin = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      // User is now authenticated
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <div>Welcome, {user?.email}!</div>;

  return <LoginForm onSubmit={handleLogin} />;
}
```

### Protected Components

```typescript
import { withAuth } from '@/lib/services/auth';

const ProtectedComponent = withAuth(
  function AdminPanel() {
    return <div>Admin content</div>;
  },
  {
    requiredRole: 'admin',
    requiredPermissions: ['admin.read'],
    redirectTo: '/login'
  }
);
```

### Server-side Authentication

```typescript
import { requireAuth, hasPermission } from '@/lib/services/auth/server';

export default function ServerComponent() {
  const user = requireAuth(); // Redirects if not authenticated

  if (!hasPermission('bookings.read')) {
    return <div>Access denied</div>;
  }

  return <div>Protected server content</div>;
}
```

### API Client Integration

```typescript
import { createApiClient } from '@/lib/services/base/api-client'
import { createAuthRequestInterceptor } from '@/lib/services/auth'

const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // ... other config
})

// Add authentication interceptor
apiClient
  .getInterceptors()
  .addRequestInterceptor(createAuthRequestInterceptor())

// All requests now include authentication automatically
const response = await apiClient.get('/protected-endpoint')
```

## 🔐 Security Features

### Token Security

- **HTTP-only Cookies**: Prevents XSS token theft
- **Secure & SameSite**: CSRF protection
- **Automatic Expiry**: Tokens expire and refresh automatically
- **Refresh Token Rotation**: Enhanced security with token rotation

### Authentication Flow

1. **Login**: User provides credentials
2. **Token Issuance**: Server returns access + refresh tokens
3. **Automatic Injection**: Tokens added to API requests
4. **Proactive Refresh**: Tokens refreshed before expiry
5. **Error Handling**: 401/403 errors trigger re-authentication

### Multi-tenant Security

- **Tenant Isolation**: Users can only access their tenant's data
- **Tenant Validation**: Server-side tenant verification
- **Context Switching**: Secure tenant context management

## 📋 Requirements Satisfied

- ✅ **1.3**: JWT token storage using HTTP-only cookies
- ✅ **1.5**: Automatic token refresh mechanism
- ✅ **3.3**: Authentication state management and validation
- ✅ **3.4**: Token management functionality

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### Cookie Configuration

- **Access Token**: 1 hour expiry, HTTP-only, Secure, SameSite=Strict
- **Refresh Token**: 7 days expiry, HTTP-only, Secure, SameSite=Strict

### Token Refresh

- **Buffer Time**: 5 minutes before expiry
- **Automatic Scheduling**: Background refresh timer
- **Retry Logic**: Exponential backoff on failures

## 🏗️ Architecture

The authentication system follows a layered architecture:

1. **Token Layer**: Low-level JWT management
2. **State Layer**: Reactive authentication state
3. **Service Layer**: High-level authentication operations
4. **Integration Layer**: API client and interceptor integration
5. **UI Layer**: React hooks and components

This provides a robust, secure, and user-friendly authentication system that handles all aspects of JWT-based authentication in a multi-tenant environment.
