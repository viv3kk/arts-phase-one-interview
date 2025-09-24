/**
 * IMPROVED Auth Hooks - Simplified & Optimized
 * Eliminates over-engineering while maintaining flexibility
 */
'use client'

import { useAuth, useUser } from '@/lib/providers/StoreProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import type {
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  OtpVerifyResponse,
} from '../../types/auth.types'
import type { GoogleUser } from '../../utils/google-auth'
import { authService } from '../auth/auth-service'

import type { ApiError } from '../base/api-client'
import { renterKeys } from './renter-hooks'

// Query keys for React Query
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

/**
 * Send OTP mutation - SIMPLIFIED
 * Uses React Query for loading states, Zustand only for business state
 */
export function useSendOtp() {
  const { setOtpRequestId, setError } = useAuth()

  const mutation = useMutation({
    mutationFn: ({
      mobileNumber,
      languageCode = 'en',
    }: {
      mobileNumber: string
      languageCode?: string
    }) => {
      setError(null) // Clear errors before starting
      return authService.sendOtp(mobileNumber, languageCode)
    },

    onSuccess: otpRequestId => {
      setOtpRequestId(otpRequestId)
    },

    onError: (error: Error) => {
      setError(error.message)
    },
  })

  return {
    // Both versions available
    sendOtp: mutation.mutate,
    sendOtpAsync: mutation.mutateAsync,
    // Use React Query loading (single source of truth)
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Google authentication mutation - SIMPLIFIED
 * Follows EXACT same pattern as OTP verification
 */
export function useGoogleAuth() {
  const { setAuthData, setError, setIsGoogleAuthInProgress, setAuthMethod } =
    useAuth()
  const { setProfile } = useUser()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ googleUser }: { googleUser: GoogleUser }) => {
      setError(null)
      setIsGoogleAuthInProgress(true)
      setAuthMethod('google')
      return authService.authenticateWithGoogle(googleUser)
    },

    onSuccess: async (response: OtpVerifyResponse) => {
      // Update auth state - SAME as useVerifyOtp
      setAuthData({
        authKey: response.authKey,
        userId: response.userId,
        method: 'google',
      })

      // Set minimal profile if name not needed - SAME as useVerifyOtp
      if (!response.askForName) {
        setProfile({
          id: response.userId,
          name: 'User',
          mobileNumber: '',
          profileComplete: true,
        })
      }

      setIsGoogleAuthInProgress(false)
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },

    onError: (error: Error) => {
      setError(error.message)
      setIsGoogleAuthInProgress(false)
      setAuthMethod(null)
    },
  })

  return {
    authenticateWithGoogle: mutation.mutate,
    authenticateWithGoogleAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Verify OTP mutation - SIMPLIFIED
 * Reduced complexity while maintaining functionality
 */
export function useVerifyOtp() {
  const { setOtpRequestId, setError, otpRequestId, setIsAuthenticated } =
    useAuth()
  // const { setProfile } = useUser()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ otp }: { otp: string }) => {
      setError(null)
      if (!otpRequestId) {
        throw new Error('No OTP request ID found. Please send OTP first.')
      }
      return authService.verifyOtp(otpRequestId, otp)
    },

    onSuccess: async () => {
      // // Update auth state
      // setAuthData({
      //   authKey: response.authKey,
      //   userId: response.userId,
      // })

      // // Set minimal profile if name not needed
      // if (!response.askForName) {
      //   setProfile({
      //     id: response.userId,
      //     name: 'User',
      //     mobileNumber: '',
      //     profileComplete: true,
      //   })
      // }

      setOtpRequestId(null)
      setIsAuthenticated(true)
      queryClient.invalidateQueries({ queryKey: renterKeys.profile() })
    },

    onError: (error: Error) => {
      setError(error.message)
    },
  })

  return {
    verifyOtp: mutation.mutate,
    verifyOtpAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * User profile query - SIMPLIFIED
 * React Query manages server state, minimal Zustand sync
 */
export function useUserProfile() {
  const { isAuthenticated } = useAuth()
  const { setProfile } = useUser()

  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getUserProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Minimal sync to Zustand (only on success)
  React.useEffect(() => {
    if (query.data && query.isSuccess) {
      setProfile({
        id: query.data.id || '',
        name: query.data.name || '',
        email: query.data.email,
        mobileNumber: query.data.mobileNumber || '',
        profileComplete: true,
      })
    }
  }, [query.data, query.isSuccess, setProfile])

  return query
}

/**
 * Business logic hook - SIMPLIFIED
 * Focuses only on flow coordination
 */
export function useLoginFlow() {
  const sendOtpMutation = useSendOtp()
  const verifyOtpMutation = useVerifyOtp()
  const googleAuthMutation = useGoogleAuth()

  const sendOtp = async (mobileNumber: string, languageCode = 'en') => {
    try {
      await sendOtpMutation.sendOtpAsync({ mobileNumber, languageCode })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      }
    }
  }

  const verifyOtp = async (otp: string) => {
    try {
      await verifyOtpMutation.verifyOtpAsync({ otp })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      }
    }
  }

  const authenticateWithGoogle = async (googleUser: GoogleUser) => {
    try {
      await googleAuthMutation.authenticateWithGoogleAsync({ googleUser })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to authenticate with Google',
      }
    }
  }

  return {
    sendOtp,
    verifyOtp,
    authenticateWithGoogle,
    isLoading:
      sendOtpMutation.isLoading ||
      verifyOtpMutation.isLoading ||
      googleAuthMutation.isLoading,
    // No error duplication - let individual hooks handle their errors
  }
}

/**
 * Session state - SIMPLIFIED
 * Single source of truth for auth status
 */
export function useAuthSession() {
  const auth = useAuth()
  const user = useUser()

  return {
    isAuthenticated: auth.isAuthenticated,
    user: user.profile,
    authKey: auth.authKey,
    userId: auth.userId,
    isLoading: auth.isLoading,
  }
}

// Export a simple logout function instead of a hook
export function useLogout() {
  const { clearAuth, setIsAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  return () => {
    authService.logout().finally(() => {
      clearAuth()
      setIsAuthenticated(false)
      queryClient.clear()
    })
  }
}

/**
 * Identity verification mutation hook
 * Follows the same pattern as auth hooks
 */
export function useIdentityVerification(
  onSuccessCallback?: (response: IdentityVerificationResponse) => void,
) {
  const mutation = useMutation({
    mutationFn: (request: IdentityVerificationRequest) => {
      return authService.initiateIdentityVerification(request)
    },

    onSuccess: (response: IdentityVerificationResponse) => {
      // Handle successful verification initiation
      if (onSuccessCallback) {
        onSuccessCallback(response)
      }
    },

    onError: (error: Error) => {
      // Extract API error details
      const apiError =
        'response' in error && error.response
          ? (error as ApiError).response?.data
          : error
      const errorType =
        (apiError as Record<string, unknown>)?.errorType || 'UNKNOWN_ERROR'
      const message = error.message || 'An unknown error occurred'
      const code = (apiError as Record<string, unknown>)?.code || 'UNKNOWN'

      console.error('Identity verification failed:', {
        errorType,
        message,
        code,
        fullError: error,
      })
    },
  })

  return {
    // Mutation functions
    initiateVerification: mutation.mutate,
    initiateVerificationAsync: mutation.mutateAsync,

    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    // Utilities
    resetVerification: mutation.reset,
    data: mutation.data,
  }
}

/**
 * Async identity verification hook for programmatic usage
 * Returns a promise that resolves with the verification response
 */
export function useIdentityVerificationAsync() {
  const { initiateVerificationAsync, isLoading, resetVerification, error } =
    useIdentityVerification()

  const initiateVerification = async (
    returnUrl: string,
  ): Promise<IdentityVerificationResponse> => {
    try {
      return await initiateVerificationAsync({ returnUrl })
    } catch (error: unknown) {
      // Extract and re-throw with proper error structure
      const apiError =
        error && typeof error === 'object' && 'response' in error
          ? (error as ApiError).response?.data
          : error
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      throw {
        errorType:
          (apiError as Record<string, unknown>)?.errorType || 'UNKNOWN_ERROR',
        message: errorMessage,
        code: (apiError as Record<string, unknown>)?.code || 'UNKNOWN',
        originalError: error,
      }
    }
  }

  return {
    initiateVerification,
    resetVerification,
    isLoading,
    error,
  }
}
