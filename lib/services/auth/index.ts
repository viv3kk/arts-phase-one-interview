/**
 * Authentication module exports
 * Centralized exports for authentication functionality
 * Requirements: 1.3, 1.5, 3.3, 3.4
 */

// Core authentication service
export { AuthService, authService } from './auth-service'

// Interceptors
export {
  createAuthErrorInterceptor,
  createAuthRequestInterceptor,
  getAuthHeaders,
} from './auth-interceptor'

// React Query hooks for auth coordination
export {
  authKeys,
  useLoginFlow,
  useLogout,
  useSendOtp,
  useAuthSession as useSession,
  useUserProfile,
  useVerifyOtp,
  useIdentityVerification,
  useIdentityVerificationAsync,
} from '../hooks/auth-hooks'

// For individual property access, use direct destructuring:
// const { isAuthenticated } = useAuth()
// const { profile } = useUser()

// Types (from types directory)
export type {
  AuthOperationState,
  AuthSession,
  OtpRequest,
  OtpVerifyRequest,
  OtpVerifyResponse,
  UserProfileResponse,
} from '../../types/auth.types'
