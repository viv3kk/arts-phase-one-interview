/**
 * Client-safe tenant utilities
 * Functions that can be safely used in browser environment (no Node.js dependencies)
 */

import { isValidTenantId, sanitizeTenantId } from '../utils'

/**
 * Client-side tenant ID processing with validation
 */
export function processTenantId(input: string | null): {
  isValid: boolean
  tenantId: string | null
  sanitized: string | null
  errors: string[]
} {
  const errors: string[] = []

  if (!input) {
    return {
      isValid: false,
      tenantId: null,
      sanitized: null,
      errors: ['No tenant ID provided'],
    }
  }

  const sanitized = sanitizeTenantId(input)
  const isValid = isValidTenantId(sanitized)

  if (!isValid) {
    errors.push('Invalid tenant ID format')
  }

  if (sanitized !== input.toLowerCase().trim()) {
    errors.push('Tenant ID was sanitized')
  }

  return {
    isValid,
    tenantId: isValid ? sanitized : null,
    sanitized,
    errors,
  }
}

/**
 * Get current tenant from browser location
 */
export function getCurrentTenant(): string | null {
  if (typeof window === 'undefined') return null

  // Try query parameter first
  const urlParams = new URLSearchParams(window.location.search)
  const queryTenant = urlParams.get('tenant')

  if (queryTenant && isValidTenantId(queryTenant)) {
    return queryTenant
  }

  // Try subdomain
  const subdomain = extractTenantFromHostname(window.location.hostname)
  return subdomain && isValidTenantId(subdomain) ? subdomain : null
}

/**
 * Client-side tenant validation
 */
export function validateTenantIdClient(tenantId: string | null): boolean {
  return tenantId ? isValidTenantId(tenantId) : false
}

/**
 * Generate tenant switch URL for client-side navigation
 */
export function generateTenantSwitchUrl(tenantId: string): string {
  if (typeof window === 'undefined') return '#'

  const currentUrl = new URL(window.location.href)

  // If using localhost, try subdomain first, fallback to query parameter
  if (currentUrl.hostname.includes('localhost')) {
    // For localhost, use query parameter since subdomain requires /etc/hosts setup
    currentUrl.searchParams.set('tenant', tenantId)
    return currentUrl.toString()
  }

  // If using subdomains, construct new subdomain URL
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aetheraiapp.com'
  const protocol = currentUrl.protocol
  const port = currentUrl.port ? `:${currentUrl.port}` : ''

  return `${protocol}//${tenantId}.${rootDomain}${port}${currentUrl.pathname}${currentUrl.search}`
}

/**
 * Check if we're in a tenant context (client-side)
 */
export function isInTenantContext(): boolean {
  return getCurrentTenant() !== null
}

/**
 * Get tenant display name from ID
 */
export function getTenantDisplayName(tenantId: string): string {
  return tenantId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Extract tenant ID from hostname (client-side safe)
 * Duplicate of utils.ts function to avoid Node.js dependencies
 */
export function extractTenantFromHostname(hostname: string): string | null {
  if (!hostname) return null

  const cleanHostname = hostname.split(':')[0]
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aetheraiapp.com'

  // Handle localhost development
  if (cleanHostname.includes('localhost')) {
    if (cleanHostname.includes('.localhost')) {
      const subdomain = cleanHostname.split('.')[0]
      return subdomain !== 'www' ? subdomain : null
    }
    return null
  }

  // Handle production domains
  const rootDomainFormatted = rootDomain.split(':')[0]
  const isSubdomain =
    cleanHostname !== rootDomainFormatted &&
    cleanHostname !== `www.${rootDomainFormatted}` &&
    cleanHostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain
    ? cleanHostname.replace(`.${rootDomainFormatted}`, '')
    : null
}
