/**
 * Standardized hook return types for consistent API across the application
 */

import { BaseAsyncState } from './store.types'

/**
 * Auth hook return type
 */
export interface AuthHookResult extends BaseAsyncState {
  // Auth state
  authKey: string | null
  userId: string | null
  isAuthenticated: boolean
  otpRequestId: string | null
  isGoogleAuthInProgress: boolean
  authMethod: 'otp' | 'google' | null

  // Modal state
  isModalOpen: boolean
  onSuccessCallback: (() => void | Promise<void>) | null

  // Actions
  setAuthData: (data: {
    authKey: string
    userId: string
    method?: 'otp' | 'google'
  }) => void
  setOtpRequestId: (requestId: string | null) => void
  setIsGoogleAuthInProgress: (inProgress: boolean) => void
  setAuthMethod: (method: 'otp' | 'google' | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  clearAuth: () => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  // Modal actions
  openLoginModal: (callback?: () => void | Promise<void>) => void
  closeLoginModal: () => void
  setSuccessCallback: (callback: (() => void | Promise<void>) | null) => void
  loginSuccessCallback: () => void

  // Computed properties
  hasValidSession: () => boolean
  needsAuthentication: () => boolean
}

/**
 * User hook return type
 */
export interface UserHookResult extends BaseAsyncState {
  // User state
  profile: import('@/lib/stores/slices/user.slice').User | null

  // Actions
  setProfile: (profile: import('@/lib/stores/slices/user.slice').User) => void
  updateProfile: (
    profileData: import('@/lib/stores/slices/user.slice').UserProfileUpdate,
  ) => void
  clearProfile: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Computed properties
  needsProfileCompletion: () => boolean
  hasValidProfile: () => boolean
  getUserDisplayName: () => string
}

/**
 * Renter hook return type
 */
export interface RenterHookResult extends BaseAsyncState {
  // Renter state
  renterProfile: import('@/lib/stores/slices/renter.slice').Renter | null

  // Actions
  setRenterProfile: (
    profile: import('@/lib/stores/slices/renter.slice').Renter,
  ) => void
  updateRenterProfile: (
    profileData: import('@/lib/stores/slices/renter.slice').RenterProfileUpdate,
  ) => void
  clearRenterProfile: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Computed properties
  hasInsuranceProof: () => boolean
  hasDriverLicense: () => boolean
  isRenterProfileComplete: () => boolean
  getRenterDisplayName: () => string
}

/**
 * React Query hook result wrapper
 */
export interface QueryHookResult<TData = unknown, TError = string> {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isSuccess: boolean
  isFetching: boolean
  refetch: () => void
  invalidate: () => void
}

/**
 * Mutation hook result wrapper
 */
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

/**
 * Hook configuration options
 */
export interface HookOptions {
  enabled?: boolean
  retry?: boolean | number
  retryDelay?: number
  refetchOnWindowFocus?: boolean
  staleTime?: number
  cacheTime?: number
}

/**
 * Store hook selector type
 */
export type StoreHookSelector<TStore, TResult> = (state: TStore) => TResult

/**
 * Action creator with typed parameters
 */
export type TypedActionCreator<TArgs extends readonly unknown[] = []> = (
  ...args: TArgs
) => void

/**
 * Computed property with memoization
 */
export type ComputedProperty<TResult> = () => TResult
