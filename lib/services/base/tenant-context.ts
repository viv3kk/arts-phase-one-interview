/**
 * Tenant Context for Multi-Tenant System
 *
 * This module handles tenant ID extraction from URL patterns and provides
 * context for API calls in a multi-tenant architecture.
 *
 * URL Patterns:
 * - https://abc-rental.qa.htravelss.com/ → tenant: abc-rental
 * - https://xyz-rentals.qa.htravelss.com/ → tenant: xyz-rentals
 * - https://test-rental.qa.htravelss.com/ → tenant: test-rental
 */

export interface TenantContext {
  tenantId: string | null
  host: string | null
  environment: 'development' | 'qa' | 'production'
}

/**
 * Extract tenant ID from host patterns
 */
export function extractTenantIdFromHost(host: string): string | null {
  const patterns = [
    /^([a-z0-9-]+)\.qa\.htravelss\.com$/i, // qa environment
    /^([a-z0-9-]+)\.htravelss\.com$/i, // production environment
    /^([a-z0-9-]+)\.localhost$/i, // local development
    /^([a-z0-9-]+)\.localhost:\d+$/i, // local development with port
  ]

  for (const pattern of patterns) {
    const match = host.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Determine environment from host
 */
export function getEnvironmentFromHost(
  host: string,
): 'development' | 'qa' | 'production' {
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return 'development'
  }
  if (host.includes('.qa.')) {
    return 'qa'
  }
  return 'production'
}

/**
 * Create tenant context from host
 */
export function createTenantContext(host: string): TenantContext {
  const tenantId = extractTenantIdFromHost(host)
  const environment = getEnvironmentFromHost(host)

  return {
    tenantId,
    host,
    environment,
  }
}

/**
 * Global tenant context (for server-side usage)
 * This would be set by Next.js middleware
 */
let globalTenantContext: TenantContext | null = null

/**
 * Set global tenant context (called by middleware)
 */
export function setGlobalTenantContext(context: TenantContext): void {
  globalTenantContext = context
}

/**
 * Get global tenant context
 */
export function getGlobalTenantContext(): TenantContext | null {
  return globalTenantContext
}

/**
 * Get current tenant ID (for API calls)
 */
export function getCurrentTenantId(): string | null {
  const context = getGlobalTenantContext()
  return context?.tenantId || null
}

/**
 * Get current environment (for API calls)
 */
export function getCurrentEnvironment(): 'development' | 'qa' | 'production' {
  const context = getGlobalTenantContext()
  if (context?.environment) {
    return context.environment
  }

  // Fallback: Try to detect environment from process.env
  if (typeof process !== 'undefined' && process.env) {
    const nodeEnv = process.env.NODE_ENV
    const vercelEnv = process.env.VERCEL_ENV
    const vercelUrl = process.env.VERCEL_URL

    console.log('🔍 ENVIRONMENT DETECTION FALLBACK:', {
      nodeEnv,
      vercelEnv,
      vercelUrl,
    })

    // In Vercel, use VERCEL_ENV if available
    if (vercelEnv) {
      switch (vercelEnv) {
        case 'development':
          return 'development'
        case 'preview':
          return 'qa'
        case 'production':
          return 'production'
        default:
          return 'development'
      }
    }

    // Fallback to NODE_ENV
    if (nodeEnv === 'production') {
      return 'production'
    }

    // Check if we're in a qa environment by looking at the URL
    if (vercelUrl && vercelUrl.includes('.qa.')) {
      return 'qa'
    }
  }

  return 'development'
}

// Import tenant utilities
import { TenantContext as ApiTenantContext, TenantResolver } from './types'

// Placeholder implementations for Edge Runtime compatibility
export class DefaultTenantResolver implements TenantResolver {
  async resolve(): Promise<ApiTenantContext | null> {
    return null
  }
  getCurrentTenant(): ApiTenantContext | null {
    return null
  }
  setTenant(): void {}
  clearTenant(): void {}
}

export class ServerTenantResolver implements TenantResolver {
  async resolve(): Promise<ApiTenantContext | null> {
    return null
  }
  getCurrentTenant(): ApiTenantContext | null {
    return null
  }
  setTenant(): void {}
  clearTenant(): void {}
}

export function injectTenantHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  return headers
}

export function validateTenantContext(): boolean {
  return false
}
