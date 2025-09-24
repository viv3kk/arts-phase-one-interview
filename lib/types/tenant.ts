/**
 * TypeScript interfaces for tenant configuration structure
 * Based on requirements 4.1, 4.2, 4.3, 4.4
 */

// Legacy theme format (object with colors)
export interface TenantThemeObject {
  primary: string
  secondary: string
  background: string
  text: string
}

// New theme format (theme ID string)
export type TenantThemeId = 'ocean' | 'fire' | 'forest'

// Union type supporting both formats
export type TenantTheme = TenantThemeId | TenantThemeObject

export interface TenantHeroContent {
  headline: string
  description: string
}

export interface TenantAboutContent {
  title: string
  content: string
}

export interface TenantContactInfo {
  phone?: string
  email?: string
  address?: string
}

export interface TenantContent {
  hero: TenantHeroContent
  about: TenantAboutContent
  contact: TenantContactInfo
}

export interface TenantSEO {
  keywords?: string[]
  favicon?: string
  openGraph?: {
    image?: string
    type?: string
    locale?: string
  }
  twitter?: {
    card?: string
    site?: string
    creator?: string
  }
  canonicalBase?: string
  robots?: string
}

export interface TenantMetadata {
  title: string
  description: string
  seo?: TenantSEO
}

export interface TenantConfig {
  id: string
  name: string
  theme: TenantTheme
  content: TenantContent
  metadata: TenantMetadata
}

export interface TenantRegistry {
  tenants: Record<string, TenantRegistryEntry>
  default: string
}

export interface TenantRegistryEntry {
  id: string
  name: string
  status: 'active' | 'inactive'
  configFile: string
}

export interface TenantContext {
  config: TenantConfig
  isLoading: boolean
  error?: string
}

// Validation result types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Default configuration type
export type DefaultTenantConfig = TenantConfig
