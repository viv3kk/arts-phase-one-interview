/**
 * Simple authentication interceptor for OTP-based API client
 * Handles authKey injection for API requests
 */

import { ERROR_CODES } from '../../config/api-endpoints'
import { ErrorInterceptor, RequestInterceptor } from '../base/interceptors'

/**
 * Create authentication request interceptor for OTP-based auth
 */
export function createAuthRequestInterceptor(): RequestInterceptor {
  return async (url, config) => {
    // Skip auth injection for auth endpoints
    if (url.includes('/auth/')) {
      return { url, config }
    }

    // For HTTP-only cookies, we don't manually set Cookie header
    // The browser automatically includes HTTP-only cookies when credentials: 'include' is set
    // This provides better security against XSS attacks

    // No need to read localStorage - HTTP-only cookies handle authentication
    // Server will validate the cookie and return appropriate response

    return { url, config }
  }
}

/**
 * Create authentication error interceptor
 */
export function createAuthErrorInterceptor(): ErrorInterceptor {
  return async (error, context) => {
    // Handle 401 Unauthorized errors
    if (error.status === 401) {
      // For HTTP-only cookies, server handles session clearing
      // No need to clear client-side data

      return {
        code: ERROR_CODES.AUTHENTICATION_ERROR,
        message: 'Authentication required',
        details: {
          redirectUrl: '/login',
          originalError: error.message,
        },
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
      }
    }

    // Handle 403 Forbidden errors
    if (error.status === 403) {
      return {
        code: ERROR_CODES.AUTHORIZATION_ERROR,
        message: 'Access denied',
        details: {
          originalError: error.message,
        },
        timestamp: new Date().toISOString(),
        requestId: context.requestId,
      }
    }

    // Return error as-is for non-auth errors
    return error
  }
}

/**
 * Get auth headers for manual requests
 * Note: For HTTP-only cookies, this returns empty object as cookies are handled automatically
 */
export function getAuthHeaders(): Record<string, string> {
  // For HTTP-only cookies, we don't return auth headers
  // The browser handles this automatically when credentials: 'include' is set
  return {}
}
