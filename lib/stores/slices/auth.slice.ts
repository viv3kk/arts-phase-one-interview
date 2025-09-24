/**
 * Auth slice for Zustand store
 * Follows slice-based architecture pattern for modularity
 */
'use client'

import {
  ActionCreator,
  BaseSlice,
  ComputedGetter,
} from '@/lib/types/store.types'
import { StateCreator } from 'zustand'

/**
 * Authentication data interface
 */
export interface AuthData {
  authKey: string
  userId: string
}

/**
 * Success callback type for modal authentication
 */
export type AuthSuccessCallback = () => void | Promise<void>

/**
 * Auth state interface extending base slice
 * Minimal state focused on authentication tokens and status
 */
export interface AuthState extends BaseSlice {
  // Core auth state
  authKey: string | null
  userId: string | null
  isAuthenticated: boolean

  // OTP flow state
  otpRequestId: string | null

  // Google auth state
  isGoogleAuthInProgress: boolean
  authMethod: 'otp' | 'google' | null

  // Modal state
  isModalOpen: boolean
  onSuccessCallback: AuthSuccessCallback | null

  // Error follows base pattern
  error: string | null

  // Auth-specific actions
  setAuthData: ActionCreator<[AuthData & { method?: 'otp' | 'google' }]>
  setOtpRequestId: ActionCreator<[string | null]>
  setIsAuthenticated: ActionCreator<[boolean]>
  setIsGoogleAuthInProgress: ActionCreator<[boolean]>
  setAuthMethod: ActionCreator<['otp' | 'google' | null]>
  clearAuth: ActionCreator<[]>

  // Modal actions
  openLoginModal: ActionCreator<[AuthSuccessCallback?]>
  closeLoginModal: ActionCreator<[]>
  setSuccessCallback: ActionCreator<[AuthSuccessCallback | null]>
  loginSuccessCallback: ActionCreator<[]>

  // Computed properties
  hasValidSession: ComputedGetter<boolean>
  needsAuthentication: ComputedGetter<boolean>
}

/**
 * Initial auth state
 */
export const initialAuthState: Omit<
  AuthState,
  | 'setAuthData'
  | 'setOtpRequestId'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'clearAuth'
  | 'openLoginModal'
  | 'closeLoginModal'
  | 'setSuccessCallback'
  | 'loginSuccessCallback'
  | 'hasValidSession'
  | 'needsAuthentication'
  | 'setIsGoogleAuthInProgress'
  | 'setAuthMethod'
  | 'setIsAuthenticated'
> = {
  authKey: null,
  userId: null,
  isAuthenticated: false,
  otpRequestId: null,
  isGoogleAuthInProgress: false,
  authMethod: null,
  isModalOpen: false,
  onSuccessCallback: null,
  isLoading: true, // Start with loading to prevent UI flicker during hydration
  error: null,
}

/**
 * Auth state slice factory
 * Creates auth slice with all actions and state management
 */
export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  ...initialAuthState,

  // Set authentication data after successful login
  setAuthData: (data: AuthData & { method?: 'otp' | 'google' }) =>
    set({
      authKey: data.authKey,
      userId: data.userId,
      isAuthenticated: true,
      authMethod: data.method || null,
      isLoading: false,
      error: null,
    }),

  // Store OTP request ID for verification
  setOtpRequestId: (requestId: string | null) =>
    set({
      otpRequestId: requestId,
    }),

  setIsAuthenticated: (isAuthenticated: boolean) =>
    set({
      isAuthenticated,
    }),

  // Set Google auth progress state
  setIsGoogleAuthInProgress: (inProgress: boolean) =>
    set({
      isGoogleAuthInProgress: inProgress,
    }),

  // Set authentication method
  setAuthMethod: (method: 'otp' | 'google' | null) =>
    set({
      authMethod: method,
    }),

  // Modal actions
  openLoginModal: (callback?: AuthSuccessCallback) =>
    set({
      isModalOpen: true,
      // Only update callback if one is provided, otherwise preserve existing callback
      onSuccessCallback:
        callback !== undefined ? callback : get().onSuccessCallback,
    }),

  closeLoginModal: () =>
    set({
      isModalOpen: false,
      onSuccessCallback: null,
      error: null, // Clear errors when closing modal
    }),

  setSuccessCallback: (callback: AuthSuccessCallback | null) =>
    set({
      onSuccessCallback: callback,
    }),

  loginSuccessCallback: async () => {
    const state = get()
    if (state.onSuccessCallback) {
      try {
        await state.onSuccessCallback()
      } catch (error) {
        console.error('Error executing success callback:', error)
      } finally {
        // Always close modal and clear callback after execution
        set({
          isModalOpen: false,
          onSuccessCallback: null,
        })
      }
    } else {
      // No callback, just close modal
      set({
        isModalOpen: false,
        onSuccessCallback: null,
      })
    }
  },

  // Set loading state (from BaseSlice)
  setLoading: (isLoading: boolean) =>
    set({
      isLoading,
    }),

  // Set error message (from BaseSlice)
  setError: (error: string | null) =>
    set({
      error,
      isLoading: false,
    }),

  // Clear error (from BaseSlice)
  clearError: () =>
    set({
      error: null,
    }),

  // Clear authentication data (logout)
  clearAuth: () =>
    set({
      ...initialAuthState,
      isGoogleAuthInProgress: false,
      authMethod: null,
      isLoading: false, // Don't show loading indicator after logout
    }),

  // Computed: Check if user has valid session
  hasValidSession: () => {
    const state = get()
    return !!(state.authKey && state.userId && state.isAuthenticated)
  },

  // Computed: Check if authentication is needed
  needsAuthentication: () => {
    const state = get()
    return !state.isAuthenticated || !state.authKey
  },
})
