import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_DEV_TENANT_ID } from './constants/development'
import {
  createTenantContext,
  setGlobalTenantContext,
} from './lib/services/base/tenant-context'

// Configuration
const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aetheraiapp.com'

/**
 * Enhanced subdomain extraction with support for multiple environments
 * Based on Vercel Platforms implementation adapted for our architecture
 */
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL first
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/)
    if (fullUrlMatch && fullUrlMatch[1] && fullUrlMatch[1] !== 'www') {
      return fullUrlMatch[1]
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      const subdomain = hostname.split('.')[0]
      return subdomain !== 'www' ? subdomain : null
    }

    return null
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0]

  // Handle Vercel preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith(`.${rootDomain}`)) {
    const parts = hostname.split('---')
    return parts.length > 0 && parts[0] ? parts[0] : null
  }

  // Regular subdomain detection for production
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null
}

/**
 * Validate and sanitize tenant ID
 */
function validateTenantId(tenantId: string | null): string | null {
  if (!tenantId) return null

  // Basic validation - alphanumeric and hyphens only, reasonable length
  const sanitized = tenantId.toLowerCase().trim()
  const isValid =
    /^[a-z0-9-]+$/.test(sanitized) &&
    sanitized.length >= 2 &&
    sanitized.length <= 50 &&
    !sanitized.startsWith('-') &&
    !sanitized.endsWith('-')

  return isValid ? sanitized : null
}

/**
 * Enhanced middleware with improved tenant detection
 * Focuses on tenant identification only (no routing rewrites for our architecture)
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Enhanced logging for production debugging
  console.log('🔍 MIDDLEWARE EXECUTION START 🔍')
  console.log('📋 Request Details:', {
    pathname,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    url: request.url,
  })

  // Extract tenant from subdomain
  const subdomain = extractSubdomain(request)

  // Fallback: Check query parameter for testing/development
  const queryTenant = searchParams.get('tenant')

  // Use subdomain first, then query parameter as fallback
  const rawTenantId = subdomain || queryTenant
  const tenantId = validateTenantId(rawTenantId)

  console.log('🔍 Tenant Extraction:', {
    subdomain,
    queryTenant,
    rawTenantId,
    validatedTenantId: tenantId,
  })

  // If we have an invalid tenant ID, redirect to main domain
  if (rawTenantId && !tenantId) {
    console.warn(`Invalid tenant ID attempted: ${rawTenantId}`)
    return NextResponse.redirect(`https://${rootDomain}`)
  }

  // Block access to admin routes from tenant subdomains (security)
  if (tenantId && pathname.startsWith('/admin')) {
    console.warn(`Admin access blocked for tenant: ${tenantId}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Create response and add tenant header for server components
  const response = NextResponse.next()

  // Set global tenant context for API calls (always set, even if no tenant)
  const host = request.headers.get('host')
  if (host) {
    const tenantContext = createTenantContext(host)
    // Override tenant ID with the validated one from subdomain extraction
    if (tenantId) {
      tenantContext.tenantId = tenantId
    }
    setGlobalTenantContext(tenantContext)

    // Enhanced debug logging for tenant context (both dev and production)
    console.log('🔍 MIDDLEWARE SETTING TENANT CONTEXT:', {
      host,
      extractedTenantId: tenantId,
      finalTenantContext: tenantContext,
    })
  }

  // Development fallback: Add default tenant for localhost without subdomain
  if (
    process.env.NODE_ENV === 'development' &&
    !tenantId &&
    host?.includes('localhost')
  ) {
    const developmentTenantId = DEFAULT_DEV_TENANT_ID
    response.headers.set('x-tenant-id', developmentTenantId)
    response.headers.set('x-tenant-source', 'development-fallback')

    // Also set the tenant context for API calls
    if (host) {
      const devTenantContext = {
        tenantId: developmentTenantId,
        host,
        environment: 'development' as const,
      }
      setGlobalTenantContext(devTenantContext)
    }

    console.log(
      `Development fallback: Using tenant ${developmentTenantId} for ${host}`,
    )
  }

  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId)

    // Add additional headers for debugging and analytics
    response.headers.set('x-tenant-source', subdomain ? 'subdomain' : 'query')

    // Enhanced tenant access logging (both dev and production)
    console.log(`Tenant access: ${tenantId} -> ${pathname}`)
  }

  console.log('🔍 MIDDLEWARE EXECUTION END 🔍')
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
