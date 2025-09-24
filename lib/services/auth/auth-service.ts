/**
 * Authentication service using shared API client
 * Handles OTP sending, verification, and session management
 */

import { API_ENDPOINTS } from '../../config/api-endpoints'
import {
  IdentityVerificationRequest,
  IdentityVerificationResponse,
  OtpRequest,
  OtpVerifyRequest,
  OtpVerifyResponse,
  UserProfileResponse,
} from '../../types/auth.types'
import type { GoogleUser } from '../../utils/google-auth'
import { createSharedApiClient } from '../base/api-client'

/**
 * Authentication service for OTP-based login
 * Uses shared API client with auth interceptors
 */
export class AuthService {
  private apiClient: ReturnType<typeof createSharedApiClient>

  constructor() {
    // Auth service needs credentials for most operations
    this.apiClient = createSharedApiClient({
      credentials: 'include',
    })
  }

  /**
   * Send OTP to mobile number
   */
  async sendOtp(
    mobileNumber: string,
    languageCode: string = 'en',
  ): Promise<string> {
    const request: OtpRequest = {
      mobileNumber,
      languageCode,
    }

    // Override service-level credentials for this public endpoint
    const response = await this.apiClient.post<{ otpRequestId: string }>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      request,
      { credentials: 'omit' },
    )

    return response.otpRequestId
  }

  /**
   * Verify OTP and authenticate user
   */
  async verifyOtp(
    otpRequestId: string,
    otp: string,
    businessProfileId?: string,
  ): Promise<OtpVerifyResponse> {
    const request: OtpVerifyRequest = {
      otpRequestId,
      otp,
      businessProfileId: businessProfileId || '',
    }

    // Uses service-level credentials (include)
    const response = await this.apiClient.post<OtpVerifyResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      request,
    )

    return response
  }

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<UserProfileResponse> {
    // Uses service-level credentials (include)
    const response = await this.apiClient.get<UserProfileResponse>(
      API_ENDPOINTS.AUTH.USER_PROFILE,
    )
    return response
  }

  /**
   * Authenticate user with Google
   * Follows EXACT same pattern as OTP verification
   */
  async authenticateWithGoogle(
    googleUser: GoogleUser,
  ): Promise<OtpVerifyResponse> {
    // Only send the authorization code - let backend handle user data
    const request = {
      authorizationCode: googleUser.idToken, // This is the auth code from Google
    }

    // Call your backend API endpoint (same pattern as OTP)
    // Backend will exchange code for tokens and fetch user info from Google
    const response = await this.apiClient.post<OtpVerifyResponse>(
      API_ENDPOINTS.AUTH.GOOGLE_AUTH,
      request,
    )

    return response
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Uses service-level credentials (include)
      await this.apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout request failed:', error)
    }
  }

  /**
   * Initiate identity verification process
   * @param request - Identity verification request with return URL
   * @returns Promise with verification response
   */
  async initiateIdentityVerification(
    request: IdentityVerificationRequest,
  ): Promise<IdentityVerificationResponse> {
    return await this.apiClient.post<IdentityVerificationResponse>(
      API_ENDPOINTS.AUTH.IDENTITY_VERIFICATION,
      request,
    )
  }
}

/**
 * Global auth service instance
 */
export const authService = new AuthService()
