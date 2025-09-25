/**
 * Types index - exports all types
 */

// API types
export * from './api'

// Feature-specific types
export * from './products.types'
// hooks.types removed - cart-only app
export * from './store.types'

// Base service types (import specific types to avoid conflicts)
export type {
  HttpResponse,
  RequestConfig,
  ServiceError,
  ValidationResult,
  TenantContext,
} from '../services/base/types'

// Note: Import tenant.ts and other base types directly where needed to avoid ambiguity
