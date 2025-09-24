/**
 * Development utilities for multi-tenant platform (CLIENT-SAFE)
 * Enhanced development experience based on Vercel Platforms patterns
 *
 * This file is safe to import in client-side components
 */

import { getTenantUrl, isDevelopment } from '../utils'
import {
  generateTenantSwitchUrl,
  getCurrentTenant,
  getTenantDisplayName,
} from './client-tenant-utils'

/**
 * Development tenant switcher data
 */
export interface DevTenantInfo {
  id: string
  name: string
  url: string
  isActive: boolean
}

/**
 * Get development tenant information for switcher (client-side safe)
 */
export function getDevTenantList(): DevTenantInfo[] {
  if (!isDevelopment()) return []

  // Hardcoded list for client-side (since we can't access fs in browser)
  // In production, this could come from an API endpoint
  const knownTenants = [
    'elite',
    'lulu',
    'abc-rentals',
    'xyz-cars',
    'test-rental',
  ]
  const currentTenant = getCurrentTenant()

  return knownTenants.map(tenantId => ({
    id: tenantId,
    name: getTenantDisplayName(tenantId),
    url: getTenantUrl(tenantId),
    isActive: currentTenant === tenantId,
  }))
}

/**
 * Development logging utility
 */
export function devLog(category: string, message: string, data?: unknown) {
  if (!isDevelopment()) return

  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  const prefix = `[${timestamp}] [${category.toUpperCase()}]`

  if (data) {
    console.log(`${prefix} ${message}`, data)
  } else {
    console.log(`${prefix} ${message}`)
  }
}

/**
 * Development tenant validation (client-side safe)
 */
export function validateDevTenant(tenantId: string): {
  isValid: boolean
  exists: boolean
  isActive: boolean
  configPath: string
  errors: string[]
} {
  const errors: string[] = []
  const knownTenants = [
    'elite',
    'lulu',
    'abc-rentals',
    'xyz-cars',
    'test-rental',
  ]

  const exists = knownTenants.includes(tenantId)
  const isActive = exists // Assume all known tenants are active for dev

  if (!exists) {
    errors.push(`Tenant '${tenantId}' not found in known tenants`)
  }

  return {
    isValid: exists && isActive,
    exists,
    isActive,
    configPath: `config/tenants/${tenantId}.json`,
    errors,
  }
}

/**
 * Generate development setup instructions
 */
export function getDevSetupInstructions(): {
  hostsEntries: string[]
  testUrls: string[]
  queryParams: string[]
} {
  const basePort = process.env.PORT || '3000'

  return {
    hostsEntries: [
      '# Add these entries to /etc/hosts for local development:',
      '127.0.0.1 elite.localhost',
      '127.0.0.1 lulu.localhost',
      '127.0.0.1 test-rental.localhost',
    ],
    testUrls: [
      `http://elite.localhost:${basePort}`,
      `http://lulu.localhost:${basePort}`,
      `http://test-rental.localhost:${basePort}`,
    ],
    queryParams: [
      `http://localhost:${basePort}?tenant=elite`,
      `http://localhost:${basePort}?tenant=lulu`,
      `http://localhost:${basePort}?tenant=test-rental`,
    ],
  }
}

/**
 * Development performance monitoring
 */
export class DevPerformanceMonitor {
  private static timers = new Map<string, number>()

  static start(label: string): void {
    if (!isDevelopment()) return
    this.timers.set(label, performance.now())
  }

  static end(label: string): number | null {
    if (!isDevelopment()) return null

    const startTime = this.timers.get(label)
    if (!startTime) return null

    const duration = performance.now() - startTime
    this.timers.delete(label)

    devLog('PERF', `${label}: ${duration.toFixed(2)}ms`)
    return duration
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }

  static async measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    this.start(label)
    const result = await fn()
    this.end(label)
    return result
  }
}

/**
 * Development configuration validator (client-side safe)
 */
export function validateDevConfiguration(): {
  isValid: boolean
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    suggestion?: string
  }>
} {
  const issues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    suggestion?: string
  }> = []

  try {
    const knownTenants = [
      'elite',
      'lulu',
      'abc-rentals',
      'xyz-cars',
      'test-rental',
    ]

    issues.push({
      type: 'info',
      message: `Found ${knownTenants.length} known tenant(s): ${knownTenants.join(', ')}`,
    })

    // Check environment variables (client-side accessible ones)
    if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
      issues.push({
        type: 'warning',
        message: 'NEXT_PUBLIC_ROOT_DOMAIN not set',
        suggestion: 'Set NEXT_PUBLIC_ROOT_DOMAIN=aetheraiapp.com in .env.local',
      })
    }

    // Check for common development issues
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    ) {
      issues.push({
        type: 'info',
        message: 'Using localhost - tenant detection via query parameter only',
        suggestion: 'Use tenant.localhost:3000 for full subdomain testing',
      })
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: `Configuration validation failed: ${error}`,
      suggestion: 'Check tenant configuration files and registry',
    })
  }

  const hasErrors = issues.some(issue => issue.type === 'error')

  return {
    isValid: !hasErrors,
    issues,
  }
}

/**
 * Development tenant switcher component data
 */
export function getDevSwitcherProps() {
  if (!isDevelopment()) return null

  return {
    currentTenant: getCurrentTenant(),
    switchUrl: (tenantId: string) => generateTenantSwitchUrl(tenantId),
  }
}
