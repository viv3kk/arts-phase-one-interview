/**
 * Tenant utility functions
 * Helper functions for tenant management and configuration handling
 */

import { TenantConfig } from '../types/tenant'
import { isValidTenantId, sanitizeTenantId } from '../utils'

// Dynamic import for server-side only functions
async function loadTenantRegistry() {
  const { loadTenantRegistry: serverLoadTenantRegistry } = await import(
    '../tenant'
  )
  return serverLoadTenantRegistry()
}

/**
 * Get list of all active tenants
 */
export async function getActiveTenants(): Promise<string[]> {
  try {
    const registry = await loadTenantRegistry()
    return Object.keys(registry.tenants).filter(
      tenantId => registry.tenants[tenantId].status === 'active',
    )
  } catch (error) {
    console.error('Failed to get active tenants:', error)
    return []
  }
}

/**
 * Check if a tenant exists and is active
 */
export async function isTenantActive(tenantId: string): Promise<boolean> {
  try {
    const registry = await loadTenantRegistry()
    const tenant = registry.tenants[tenantId]
    return tenant && tenant.status === 'active'
  } catch (error) {
    console.error(`Failed to check tenant status for ${tenantId}:`, error)
    return false
  }
}

/**
 * Get tenant display name from registry
 */
export async function getTenantDisplayName(
  tenantId: string,
): Promise<string | null> {
  try {
    const registry = await loadTenantRegistry()
    const tenant = registry.tenants[tenantId]
    return tenant ? tenant.name : null
  } catch (error) {
    console.error(`Failed to get display name for tenant ${tenantId}:`, error)
    return null
  }
}

/**
 * Validate color hex codes in theme configuration
 */
// TODO: Remove this once we have a proper type for the theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateThemeColors(theme: any): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

  const colorFields = ['primary', 'secondary', 'background', 'text']

  for (const field of colorFields) {
    if (!theme[field] || !hexColorRegex.test(theme[field])) {
      return false
    }
  }

  return true
}

/**
 * Sanitize tenant configuration to prevent XSS
 */
export function sanitizeTenantConfig(config: TenantConfig): TenantConfig {
  // Basic HTML entity encoding for text content
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  return {
    ...config,
    name: escapeHtml(config.name),
    content: {
      hero: {
        headline: escapeHtml(config.content.hero.headline),
        description: escapeHtml(config.content.hero.description),
      },
      about: {
        title: escapeHtml(config.content.about.title),
        content: escapeHtml(config.content.about.content),
      },
      contact: {
        phone: config.content.contact.phone
          ? escapeHtml(config.content.contact.phone)
          : undefined,
        email: config.content.contact.email
          ? escapeHtml(config.content.contact.email)
          : undefined,
        address: config.content.contact.address
          ? escapeHtml(config.content.contact.address)
          : undefined,
      },
    },
    metadata: {
      title: escapeHtml(config.metadata.title),
      description: escapeHtml(config.metadata.description),
    },
  }
}

/**
 * Create CSS custom properties object from theme configuration
 */
// TODO: Remove this once we have a proper type for the theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createThemeCSSProperties(theme: any): Record<string, string> {
  return {
    '--tenant-primary': theme.primary,
    '--tenant-secondary': theme.secondary,
    '--tenant-background': theme.background,
    '--tenant-text': theme.text,
  }
}

/**
 * Log configuration loading for debugging
 */
export function logConfigurationLoad(
  tenantId: string,
  success: boolean,
  fallback: boolean = false,
): void {
  const timestamp = new Date().toISOString()
  const status = success ? 'SUCCESS' : 'FAILED'
  const fallbackText = fallback ? ' (using fallback)' : ''

  console.log(
    `[${timestamp}] Tenant Config ${status}: ${tenantId}${fallbackText}`,
  )
}

/**
 * Get configuration file path for a tenant
 */
export function getTenantConfigPath(tenantId: string): string {
  return `config/tenants/${tenantId}.json`
}

/**
 * Check if configuration file exists for a tenant
 */
export async function configFileExists(tenantId: string): Promise<boolean> {
  try {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const configPath = path.join(
      process.cwd(),
      'config',
      'tenants',
      `${tenantId}.json`,
    )
    await fs.access(configPath)
    return true
  } catch {
    return false
  }
}

/**
 * Validate tenant exists and is active
 */
export async function validateTenantExists(tenantId: string): Promise<boolean> {
  if (!isValidTenantId(tenantId)) {
    return false
  }

  try {
    const registry = await loadTenantRegistry()
    const tenant = registry.tenants[tenantId]
    return tenant && tenant.status === 'active'
  } catch (error) {
    console.error(`Failed to validate tenant ${tenantId}:`, error)
    return false
  }
}

/**
 * Get tenant metadata for analytics and monitoring
 */
export async function getTenantMetadata(tenantId: string): Promise<{
  id: string
  name: string
  status: string
  configFile: string
} | null> {
  try {
    const registry = await loadTenantRegistry()
    const tenant = registry.tenants[tenantId]

    if (!tenant) return null

    return {
      id: tenant.id,
      name: tenant.name,
      status: tenant.status,
      configFile: tenant.configFile,
    }
  } catch (error) {
    console.error(`Failed to get tenant metadata for ${tenantId}:`, error)
    return null
  }
}

/**
 * Enhanced tenant ID processing with validation
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
 * Enhanced error handling for tenant operations
 */
export class TenantError extends Error {
  constructor(
    message: string,
    public tenantId: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'TenantError'
  }
}

/**
 * Create tenant-specific error
 */
export function createTenantError(
  tenantId: string,
  code: string,
  message: string,
  statusCode: number = 400,
): TenantError {
  return new TenantError(message, tenantId, code, statusCode)
}

/**
 * Handle tenant operation with error wrapping
 */
export async function withTenantErrorHandling<T>(
  tenantId: string,
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createTenantError(
      tenantId,
      `${operationName.toUpperCase()}_FAILED`,
      `Failed to ${operationName} for tenant ${tenantId}: ${message}`,
      500,
    )
  }
}
