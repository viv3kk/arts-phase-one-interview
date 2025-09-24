/**
 * Development Constants
 *
 * Centralized configuration for development environment
 * Easily switch between tenants for testing
 */

/**
 * Default tenant ID for development
 * Change this to switch between different tenants during development
 *
 * Available tenants:
 * - abc-rental (default)
 * - xyz-rentals
 * - test-rental
 */
export const DEFAULT_DEV_TENANT_ID = 'abc-rental'

/**
 * Development environment configuration
 */
export const DEV_CONFIG = {
  DEFAULT_TENANT_ID: DEFAULT_DEV_TENANT_ID,
  FALLBACK_TENANT_ID: 'abc-rental', // Fallback if tenant resolution fails
} as const
