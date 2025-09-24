/**
 * API endpoint configurations
 */

// Base API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// API endpoint paths
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SEND_OTP: '/api/auth/renter/login/mobile/otp/send',
    VERIFY_OTP: '/api/auth/renter/login/mobile/otp/verify',
    GOOGLE_AUTH: '/api/google/auth', // Your backend endpoint
    LOGOUT: '/api/auth/logout',
    USER_PROFILE: '/api/user/profile',
    IDENTITY_VERIFICATION: '/api/secure/renter/identity-verification',
  },

  // Renter endpoints
  RENTER: {
    GET_PROFILE: '/api/secure/renter',
    UPDATE_PROFILE: '/api/secure/renter',
    PROFILE: '/api/renter/profile',
    DOCUMENTS: '/api/renter/documents',
    VERIFICATION_STATUS: '/api/renter/verification-status',
  },

  // Renter booking endpoints
  RENTER_BOOKING: {
    LIST: '/api/secure/renter/bookings',
    DETAIL: (bookingId: string) => `/api/secure/renter/bookings/${bookingId}`,
    UPDATE_DOCUMENTS: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/document`,
    CHECK_IN_OUT: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/check-in-out-detail`,
  },

  // Checkout endpoints
  CHECKOUT: {
    CREATE_CHECKOUT: '/api/secure/checkout/pre',
    GET_CHECKOUT: (id: string) => `/api/secure/checkout/${id}`,
    CREATE_STRIPE_SESSION: (id: string) =>
      `/api/secure/checkout/${id}/create-session`,
    GET_INVOICE: (id: string) => `/api/secure/checkout/${id}/invoice`,
    CALCULATE_PRICE: '/api/checkout/calculate-price',
    CONFIRM_PAYMENT: (id: string) => `/api/checkout/session/${id}/confirm`,
    CANCEL: (id: string) => `/api/checkout/session/${id}/cancel`,
  },

  // File upload endpoints
  UPLOAD: {
    FILE: '/api/upload/file',
    MULTIPLE: '/api/upload/multiple',
    DELETE: (id: string) => `/api/upload/${id}`,
    PROGRESS: (id: string) => `/api/upload/progress/${id}`,
    GENERIC_FILE: '/api/secure/generic-file-upload',
  },

  // Vehicle endpoints (public business vehicle controller)
  VEHICLES: {
    FILTERS: '/api/public/filter/PUBLIC_VEHICLE_FILTERS',
    LIST: '/api/public/business/vehicles',
    DETAIL: (vehicleId: string) => `/api/public/business/vehicles/${vehicleId}`,
    ADDONS: (vehicleId: string) =>
      `/api/public/business/vehicles/${vehicleId}/add-on`,
  },

  // Chat endpoints
  CHAT: {
    GET_CHAT: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/chat`,
    SEND_MESSAGE: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/chat/message`,
    REACT_TO_MESSAGE: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/chat/message/react`,
    MARK_MESSAGES_READ: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/chat/message/read`,
    GET_UNREAD_MESSAGES: (bookingId: string) =>
      `/api/secure/renter/bookings/${bookingId}/chat/message/unread`,
  },
} as const

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const

// Request headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  TENANT_ID: 'X-Tenant-ID',
  REQUEST_ID: 'X-Request-ID',
  USER_AGENT: 'User-Agent',
} as const

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const

// Error codes
export const ERROR_CODES = {
  // Network and connectivity errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  DNS_ERROR: 'DNS_ERROR',

  // Validation and input errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SCHEMA_VALIDATION_ERROR: 'SCHEMA_VALIDATION_ERROR',
  REQUIRED_FIELD_ERROR: 'REQUIRED_FIELD_ERROR',

  // Authentication and authorization errors
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // HTTP status errors
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT_ERROR: 'CONFLICT_ERROR',

  // Business logic errors
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
  BOOKING_UNAVAILABLE: 'BOOKING_UNAVAILABLE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  DOCUMENT_VERIFICATION_FAILED: 'DOCUMENT_VERIFICATION_FAILED',

  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  FILE_CORRUPTED: 'FILE_CORRUPTED',

  // Tenant and configuration errors
  TENANT_ERROR: 'TENANT_ERROR',
  TENANT_NOT_FOUND: 'TENANT_NOT_FOUND',
  TENANT_CONFIGURATION_ERROR: 'TENANT_CONFIGURATION_ERROR',

  // Rate limiting and throttling
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // OTP specific errors
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const
