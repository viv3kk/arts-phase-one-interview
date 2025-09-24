/**
 * Utility functions for multi-tenant platform
 * Based on Vercel Platforms patterns adapted for our needs
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Environment and domain configuration
export const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aetheraiapp.com'

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validate tenant ID format
 */
export function isValidTenantId(tenantId: string): boolean {
  if (!tenantId || typeof tenantId !== 'string') return false

  const sanitized = tenantId.toLowerCase().trim()
  return (
    /^[a-z0-9-]+$/.test(sanitized) &&
    sanitized.length >= 2 &&
    sanitized.length <= 50 &&
    !sanitized.startsWith('-') &&
    !sanitized.endsWith('-') &&
    !sanitized.includes('--')
  ) // No consecutive hyphens
}

/**
 * Sanitize tenant ID input
 */
export function sanitizeTenantId(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}

/**
 * Generate tenant URL
 */
export function getTenantUrl(tenantId: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${protocol}://${tenantId}.${rootDomain}${cleanPath}`
}

/**
 * Generate main platform URL
 */
export function getMainUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${protocol}://${rootDomain}${cleanPath}`
}

/**
 * Extract tenant ID from hostname (client-side safe)
 */
export function extractTenantFromHostname(hostname: string): string | null {
  if (!hostname) return null

  const cleanHostname = hostname.split(':')[0]

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

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Format tenant display name
 */
export function formatTenantName(tenantId: string): string {
  return tenantId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate tenant-specific cache key
 */
export function getTenantCacheKey(tenantId: string, key: string): string {
  return `tenant:${tenantId}:${key}`
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generate secure random string for tenant operations
 */
export function generateSecureId(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Re-export price utilities
export * from './utils/price-utils'

// Re-export  date-time utilities
export * from './utils/date-time'
