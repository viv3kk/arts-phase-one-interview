/**
 * Tenant configuration utilities
 * Handles loading, validation, and fallback for tenant configurations
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { promises as fs } from 'fs'
import path from 'path'
import {
  DefaultTenantConfig,
  TenantConfig,
  TenantRegistry,
  ValidationResult,
} from './types/tenant'

// Configuration paths
const CONFIG_DIR = path.join(process.cwd(), 'config')
const TENANTS_REGISTRY_PATH = path.join(CONFIG_DIR, 'tenants.json')
const TENANTS_CONFIG_DIR = path.join(CONFIG_DIR, 'tenants')

/**
 * Load the tenant registry from JSON file
 */
export async function loadTenantRegistry(): Promise<TenantRegistry> {
  try {
    const registryData = await fs.readFile(TENANTS_REGISTRY_PATH, 'utf-8')
    const registry: TenantRegistry = JSON.parse(registryData)
    return registry
  } catch (error) {
    console.error('Failed to load tenant registry:', error)
    // Return minimal registry with default fallback
    return {
      tenants: {},
      default: 'default.json',
    }
  }
}

/**
 * Load a specific tenant configuration by ID
 */
export async function loadTenantConfig(
  tenantId: string,
): Promise<TenantConfig | null> {
  try {
    const registry = await loadTenantRegistry()

    // Check if tenant exists in registry
    const tenantEntry = registry.tenants[tenantId]
    if (!tenantEntry || tenantEntry.status !== 'active') {
      console.warn(`Tenant ${tenantId} not found or inactive in registry`)
      return null
    }

    // Load tenant configuration file
    const configPath = path.join(TENANTS_CONFIG_DIR, tenantEntry.configFile)
    const configData = await fs.readFile(configPath, 'utf-8')
    const config: TenantConfig = JSON.parse(configData)

    // Validate configuration
    const validation = validateTenantConfig(config)
    if (!validation.isValid) {
      console.error(
        `Invalid configuration for tenant ${tenantId}:`,
        validation.errors,
      )
      return null
    }

    return config
  } catch (error) {
    console.error(`Failed to load configuration for tenant ${tenantId}:`, error)
    return null
  }
}

/**
 * Load the default fallback configuration
 */
export async function loadDefaultConfig(): Promise<DefaultTenantConfig> {
  try {
    const registry = await loadTenantRegistry()
    const defaultConfigPath = path.join(TENANTS_CONFIG_DIR, registry.default)

    const configData = await fs.readFile(defaultConfigPath, 'utf-8')
    const config: DefaultTenantConfig = JSON.parse(configData)

    // Validate default configuration
    const validation = validateTenantConfig(config)
    if (!validation.isValid) {
      console.error('Invalid default configuration:', validation.errors)
      // Return hardcoded fallback if default config is invalid
      return getHardcodedFallbackConfig()
    }

    return config
  } catch (error) {
    console.error('Failed to load default configuration:', error)
    return getHardcodedFallbackConfig()
  }
}

/**
 * Get tenant configuration with fallback to default
 * This is the main function to use for getting tenant config
 */
export async function getTenantConfig(
  tenantId: string | null,
): Promise<TenantConfig> {
  // If no tenant ID provided, use default
  if (!tenantId) {
    return await loadDefaultConfig()
  }

  // Try to load tenant-specific configuration
  const tenantConfig = await loadTenantConfig(tenantId)

  // If tenant config not found or invalid, fall back to default
  if (!tenantConfig) {
    console.info(
      `Falling back to default configuration for tenant: ${tenantId}`,
    )
    return await loadDefaultConfig()
  }

  return tenantConfig
}

/**
 * Validate tenant configuration structure and required fields
 */
// TODO: Remove this once we have a proper type for the config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateTenantConfig(config: any): ValidationResult {
  const errors: string[] = []

  // Check required top-level fields
  if (!config.id || typeof config.id !== 'string') {
    errors.push('Missing or invalid id field')
  }

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Missing or invalid name field')
  }

  // Validate theme (supports both new string format and legacy object format)
  if (!config.theme) {
    errors.push('Missing theme field')
  } else if (typeof config.theme === 'string') {
    // New format: theme ID string
    const validThemeIds = ['ocean', 'fire', 'forest']
    if (!validThemeIds.includes(config.theme)) {
      errors.push(
        `Invalid theme ID. Must be one of: ${validThemeIds.join(', ')}`,
      )
    }
  } else if (typeof config.theme === 'object') {
    // Legacy format: theme object with colors
    const requiredThemeFields = ['primary', 'secondary', 'background', 'text']
    for (const field of requiredThemeFields) {
      if (!config.theme[field] || typeof config.theme[field] !== 'string') {
        errors.push(`Missing or invalid theme.${field} field`)
      }
    }
  } else {
    errors.push(
      'Theme must be either a string ID or an object with color properties',
    )
  }

  // Validate content object
  if (!config.content || typeof config.content !== 'object') {
    errors.push('Missing or invalid content object')
  } else {
    // Validate hero content
    if (!config.content.hero || typeof config.content.hero !== 'object') {
      errors.push('Missing or invalid content.hero object')
    } else {
      if (
        !config.content.hero.headline ||
        typeof config.content.hero.headline !== 'string'
      ) {
        errors.push('Missing or invalid content.hero.headline field')
      }
      if (
        !config.content.hero.description ||
        typeof config.content.hero.description !== 'string'
      ) {
        errors.push('Missing or invalid content.hero.description field')
      }
    }

    // Validate about content
    if (!config.content.about || typeof config.content.about !== 'object') {
      errors.push('Missing or invalid content.about object')
    } else {
      if (
        !config.content.about.title ||
        typeof config.content.about.title !== 'string'
      ) {
        errors.push('Missing or invalid content.about.title field')
      }
      if (
        !config.content.about.content ||
        typeof config.content.about.content !== 'string'
      ) {
        errors.push('Missing or invalid content.about.content field')
      }
    }

    // Validate contact content (optional fields, but object must exist)
    if (!config.content.contact || typeof config.content.contact !== 'object') {
      errors.push('Missing or invalid content.contact object')
    }
  }

  // Validate metadata object
  if (!config.metadata || typeof config.metadata !== 'object') {
    errors.push('Missing or invalid metadata object')
  } else {
    if (!config.metadata.title || typeof config.metadata.title !== 'string') {
      errors.push('Missing or invalid metadata.title field')
    }
    if (
      !config.metadata.description ||
      typeof config.metadata.description !== 'string'
    ) {
      errors.push('Missing or invalid metadata.description field')
    }

    // Validate SEO configuration if present
    if (config.metadata.seo) {
      // Import SEO validation synchronously
      const seoValidation = validateSEOConfigSync(config.metadata.seo)
      if (!seoValidation.isValid) {
        errors.push(...seoValidation.errors)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Extract tenant ID from hostname
 * Supports subdomain-based tenant identification
 */
export function extractTenantFromHostname(hostname: string): string | null {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0]

  // For localhost development, check for tenant in subdomain
  if (cleanHostname.includes('localhost')) {
    const parts = cleanHostname.split('.')
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0]
    }
    return null
  }

  // For production domains, extract subdomain
  const parts = cleanHostname.split('.')
  if (parts.length > 2) {
    // Return the first part as tenant ID (subdomain)
    return parts[0]
  }

  return null
}

/**
 * Validate SEO configuration (sync version for use in validateTenantConfig)
 */
// TODO: Remove this once we have a proper type for the seo config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateSEOConfigSync(seo: any): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (seo) {
    // Validate keywords
    if (seo.keywords && !Array.isArray(seo.keywords)) {
      errors.push('SEO keywords must be an array of strings')
    }

    // Validate favicon path
    if (seo.favicon && typeof seo.favicon !== 'string') {
      errors.push('SEO favicon must be a string path')
    }

    // Validate Open Graph
    if (seo.openGraph) {
      if (seo.openGraph.image && typeof seo.openGraph.image !== 'string') {
        errors.push('Open Graph image must be a string URL')
      }
      if (seo.openGraph.type && typeof seo.openGraph.type !== 'string') {
        errors.push('Open Graph type must be a string')
      }
    }

    // Validate Twitter
    if (seo.twitter) {
      if (
        seo.twitter.card &&
        !['summary', 'summary_large_image', 'app', 'player'].includes(
          seo.twitter.card,
        )
      ) {
        errors.push(
          'Twitter card must be one of: summary, summary_large_image, app, player',
        )
      }
    }

    // Validate canonical base
    if (seo.canonicalBase && typeof seo.canonicalBase !== 'string') {
      errors.push('Canonical base must be a string URL')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Hardcoded fallback configuration for extreme error cases
 */
function getHardcodedFallbackConfig(): DefaultTenantConfig {
  return {
    id: 'fallback',
    name: 'Car Rental Service',
    theme: 'ocean',
    content: {
      hero: {
        headline: 'Car Rental Service',
        description: 'Reliable vehicle rentals for your transportation needs',
      },
      about: {
        title: 'About Us',
        content:
          'We provide car rental services to help you get where you need to go.',
      },
      contact: {
        phone: '+1-555-0000',
        email: 'info@example.com',
      },
    },
    metadata: {
      title: 'Car Rental Service',
      description: 'Reliable car rental services',
    },
  }
}
