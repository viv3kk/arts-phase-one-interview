/**
 * Authentication types for OTP-based auth
 * Based on actual API: /api/auth/renter/login/mobile/otp/*
 */

import { BaseAsyncState, BaseError } from './store.types'

/**
 * OTP request payload
 */
export interface OtpRequest {
  mobileNumber: string
  languageCode: string
}

/**
 * OTP verification request payload
 */
export interface OtpVerifyRequest {
  otpRequestId: string
  otp: string
  businessProfileId?: string
}

/**
 * OTP verification response from API
 */
export interface OtpVerifyResponse {
  authKey: string
  userId: string
  askForName: boolean
}

/**
 * User profile response from API
 */
export interface UserProfileResponse {
  id: string
  name: string
  email: string
  mobileNumber: string
  profileComplete?: boolean
}

/**
 * Authentication session data
 */
export interface AuthSession {
  authKey: string
  userId: string
  askForName: boolean
  otpRequestId?: string
}

/**
 * Auth error with specific codes
 */
export interface AuthError extends BaseError {
  code:
    | 'INVALID_OTP'
    | 'EXPIRED_OTP'
    | 'INVALID_MOBILE'
    | 'SESSION_EXPIRED'
    | 'UNKNOWN'
  field?: 'mobileNumber' | 'otp' | 'authKey'
}

export interface IdentityVerificationRequest {
  returnUrl: string
}

export interface IdentityVerificationResponse {
  clientSecret: string
}

export interface IdentityVerificationError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * Service-layer auth state (for React Query hooks)
 * Different from store auth state - this is for API operation tracking
 */
export interface AuthOperationState extends BaseAsyncState {
  session: AuthSession | null
}
