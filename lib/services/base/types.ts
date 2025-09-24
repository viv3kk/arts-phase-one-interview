/**
 * Base service types and interfaces
 */

// Base HTTP response wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
  cache?: boolean
  method?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

// Upload configuration
export interface UploadConfig extends RequestConfig {
  onProgress?: (_progress: number) => void
  maxFileSize?: number
  allowedTypes?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
}

// Pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Tenant context
export interface TenantContext {
  tenantId: string
  subdomain?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>
}

// Request context
export interface RequestContext {
  tenantId?: string
  userId?: string
  requestId: string
  timestamp: string
  userAgent?: string
  ip?: string
  token?: string
  authKey?: string
}

// Service error base
export interface ServiceError {
  code: string
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>
  field?: string
  timestamp: string
  requestId: string
  tenantId?: string
}

// Validation error
export interface ValidationError extends ServiceError {
  field: string
  constraint: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rejectedValue: any
}

// Network error
export interface NetworkError extends ServiceError {
  statusCode?: number
  retryable: boolean
  retryAfter?: number
}

// Authentication error
export interface AuthenticationError extends ServiceError {
  authRequired: boolean
  redirectUrl?: string
}

// Business logic error
export interface BusinessLogicError extends ServiceError {
  businessCode: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>
}

// Tenant error
export interface TenantError extends ServiceError {
  tenantId: string
  configIssue?: string
}

// File upload error
export interface FileUploadError extends ServiceError {
  fileName?: string
  fileSize?: number
  maxSize?: number
  allowedTypes?: string[]
}

// Rate limiting error
export interface RateLimitError extends NetworkError {
  limit: number
  remaining: number
  resetTime: string
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error category for classification
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  BUSINESS_LOGIC = 'business_logic',
  TENANT = 'tenant',
  FILE_UPLOAD = 'file_upload',
  SYSTEM = 'system',
}

// Upload progress
export interface UploadProgress {
  uploadId: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  error?: string
}

// File constraints
export interface FileConstraints {
  maxSize: number
  allowedTypes: string[]
  maxFiles?: number
}

// Validation result
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

// Tenant resolver interface
export interface TenantResolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(_context?: any): Promise<TenantContext | null>
  getCurrentTenant(): TenantContext | null
  setTenant(_tenant: TenantContext): void
  clearTenant(): void
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  tenantResolver?: TenantResolver
  enableLogging?: boolean
  enableCaching?: boolean
}

// Cache strategy
export interface CacheStrategy {
  ttl: number
  key: string
  invalidateOn?: string[]
}
