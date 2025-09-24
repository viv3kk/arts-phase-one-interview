/**
 * Base service layer exports
 * Provides centralized access to all base service utilities
 */

// Core API client
export {
  ApiClient,
  createApiClient,
  createSharedApiClient,
  sharedApiClient,
  type ApiConfig,
  type ApiError,
  type ApiResponse,
} from './api-client'

// Interceptors
export {
  createDefaultErrorInterceptors,
  createDefaultRequestInterceptors,
  createDefaultResponseInterceptors,
  InterceptorManager,
} from './interceptors'

export type {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from './interceptors'

// Tenant context
export { DefaultTenantResolver } from './tenant-context'

// Types
export type {
  ApiClientConfig,
  AuthenticationError,
  BusinessLogicError,
  CacheStrategy,
  ErrorCategory,
  ErrorSeverity,
  FileConstraints,
  FileUploadError,
  HttpResponse,
  NetworkError,
  RateLimitError,
  RequestConfig,
  RequestContext,
  ServiceError,
  TenantContext,
  TenantError,
  TenantResolver,
  UploadConfig,
  UploadProgress,
  ValidationError,
  ValidationResult,
} from './types'
