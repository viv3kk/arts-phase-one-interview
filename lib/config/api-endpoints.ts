/**
 * API endpoint configurations for Products
 */

// Base API configuration
export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Products API endpoints (DummyJSON API)
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: 'https://dummyjson.com/products',
    DETAIL: (id: number) => `https://dummyjson.com/products/${id}`,
    SEARCH: 'https://dummyjson.com/products/search',
    CATEGORIES: 'https://dummyjson.com/products/categories',
    CATEGORY_LIST: 'https://dummyjson.com/products/category-list',
    BY_CATEGORY: (category: string) =>
      `https://dummyjson.com/products/category/${category}`,
    CREATE: 'https://dummyjson.com/products/add',
    UPDATE: (id: number) => `https://dummyjson.com/products/${id}`,
    DELETE: (id: number) => `https://dummyjson.com/products/${id}`,
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
