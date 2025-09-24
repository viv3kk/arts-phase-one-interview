/**
 * Service layer configuration
 */

import { ApiClientConfig } from '../services/base/types'

// Environment-specific configurations
export const SERVICE_CONFIG = {
  development: {
    enableLogging: true,
    enableCaching: true,
    logLevel: 'debug',
    cacheDefaultTTL: 5 * 60 * 1000, // 5 minutes
  },
  production: {
    enableLogging: true,
    enableCaching: true,
    logLevel: 'error',
    cacheDefaultTTL: 15 * 60 * 1000, // 15 minutes
  },
  test: {
    enableLogging: false,
    enableCaching: false,
    logLevel: 'silent',
    cacheDefaultTTL: 0,
  },
} as const

// Cache configurations for different data types
export const CACHE_CONFIG = {
  USER_PROFILE: {
    ttl: 10 * 60 * 1000, // 10 minutes
    key: 'user-profile',
    invalidateOn: ['profile-update', 'logout'],
  },
  TENANT_CONFIG: {
    ttl: 60 * 60 * 1000, // 1 hour
    key: 'tenant-config',
    invalidateOn: ['tenant-update'],
  },
  BOOKING_LIST: {
    ttl: 2 * 60 * 1000, // 2 minutes
    key: 'booking-list',
    invalidateOn: ['booking-create', 'booking-update', 'booking-cancel'],
  },
  BOOKING_DETAIL: {
    ttl: 5 * 60 * 1000, // 5 minutes
    key: 'booking-detail',
    invalidateOn: ['booking-update', 'booking-cancel', 'chat-message'],
  },
  VERIFICATION_STATUS: {
    ttl: 30 * 60 * 1000, // 30 minutes
    key: 'verification-status',
    invalidateOn: ['document-upload', 'verification-update'],
  },
} as const

// File upload constraints
export const FILE_CONSTRAINTS = {
  DOCUMENT: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 5,
  },
  IMAGE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10,
  },
  PROFILE_PICTURE: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1,
  },
} as const

// Retry configuration
export const RETRY_CONFIG = {
  DEFAULT: {
    attempts: 3,
    delay: 1000,
    backoffFactor: 2,
    maxDelay: 10000,
  },
  FILE_UPLOAD: {
    attempts: 5,
    delay: 2000,
    backoffFactor: 1.5,
    maxDelay: 30000,
  },
  AUTHENTICATION: {
    attempts: 2,
    delay: 500,
    backoffFactor: 2,
    maxDelay: 2000,
  },
} as const

// Request timeout configurations
export const TIMEOUT_CONFIG = {
  DEFAULT: 30000, // 30 seconds
  FILE_UPLOAD: 120000, // 2 minutes
  AUTHENTICATION: 10000, // 10 seconds
  QUICK_OPERATIONS: 5000, // 5 seconds
} as const

// Get current environment configuration
export function getCurrentConfig() {
  const env = process.env.NODE_ENV || 'development'
  return (
    SERVICE_CONFIG[env as keyof typeof SERVICE_CONFIG] ||
    SERVICE_CONFIG.development
  )
}

// Create default API client configuration
export function createDefaultApiClientConfig(): Partial<ApiClientConfig> {
  const currentConfig = getCurrentConfig()

  return {
    timeout: TIMEOUT_CONFIG.DEFAULT,
    retryAttempts: RETRY_CONFIG.DEFAULT.attempts,
    retryDelay: RETRY_CONFIG.DEFAULT.delay,
    enableLogging: currentConfig.enableLogging,
    enableCaching: currentConfig.enableCaching,
  }
}
