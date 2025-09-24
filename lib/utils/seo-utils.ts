/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Revisit for lint <any>
/**
 * SEO utility functions for generating metadata and structured data
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { Metadata } from 'next'
import { getTheme } from '../themes'
import { TenantConfig } from '../types/tenant'

/**
 * Generate comprehensive metadata for a tenant
 */
export function generateTenantMetadata(
  config: TenantConfig,
  pathname: string = '/',
): Metadata {
  const seo = config.metadata.seo
  const baseUrl = seo?.canonicalBase || 'https://example.com'
  const canonicalUrl = `${baseUrl}${pathname}`

  const metadata: Metadata = {
    title: config.metadata.title,
    description: config.metadata.description,
    robots: seo?.robots || 'index, follow',
    keywords: seo?.keywords?.join(', '),

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: config.metadata.title,
      description: config.metadata.description,
      url: canonicalUrl,
      siteName: config.name,
      type: (seo?.openGraph?.type as any) || 'website',
      locale: seo?.openGraph?.locale || 'en_US',
      images: seo?.openGraph?.image
        ? [
            {
              url: seo.openGraph.image,
              width: 1200,
              height: 630,
              alt: `${config.name} - ${config.metadata.title}`,
            },
          ]
        : [],
    },

    // Twitter
    twitter: {
      card: (seo?.twitter?.card as any) || 'summary_large_image',
      site: seo?.twitter?.site,
      creator: seo?.twitter?.creator,
      title: config.metadata.title,
      description: config.metadata.description,
      images: seo?.openGraph?.image ? [seo.openGraph.image] : [],
    },

    // Additional metadata
    authors: [{ name: config.name }],
    creator: config.name,
    publisher: config.name,

    // Verification and other meta tags
    other: {
      'theme-color': getTheme(
        typeof config.theme === 'string' ? config.theme : undefined,
      ).colors.primary,
      'msapplication-TileColor': getTheme(
        typeof config.theme === 'string' ? config.theme : undefined,
      ).colors.primary,
    },
  }

  // Remove undefined values to clean up the metadata
  return cleanMetadata(metadata)
}

/**
 * Generate page-specific metadata that extends tenant metadata
 */
export function generatePageMetadata(
  config: TenantConfig,
  pageTitle: string,
  pageDescription: string,
  pathname: string = '/',
): Metadata {
  const baseMetadata = generateTenantMetadata(config, pathname)

  return {
    ...baseMetadata,
    title: `${pageTitle} | ${config.name}`,
    description: pageDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${pageTitle} | ${config.name}`,
      description: pageDescription,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${pageTitle} | ${config.name}`,
      description: pageDescription,
    },
  }
}

/**
 * Generate structured data (JSON-LD) for local business
 */
export function generateLocalBusinessStructuredData(
  config: TenantConfig,
): string {
  const contact = config.content.contact
  const seo = config.metadata.seo

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: config.name,
    description: config.metadata.description,
    url: seo?.canonicalBase,
    logo: seo?.openGraph?.image,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phone,
      email: contact.email,
      contactType: 'customer service',
    },
    address: contact.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: contact.address,
        }
      : undefined,
    sameAs: seo?.twitter?.site
      ? [`https://twitter.com/${seo.twitter.site.replace('@', '')}`]
      : [],
  }

  // Remove undefined values
  const cleanedData = JSON.parse(JSON.stringify(structuredData))
  return JSON.stringify(cleanedData, null, 2)
}

/**
 * Generate favicon links for different sizes and formats
 */
export function generateFaviconLinks(faviconPath?: string): Array<{
  rel: string
  href: string
  sizes?: string
  type?: string
}> {
  if (!faviconPath) {
    return [{ rel: 'icon', href: '/favicon.ico' }]
  }

  const basePath = faviconPath.replace(/\.[^/.]+$/, '') // Remove extension

  return [
    { rel: 'icon', href: faviconPath },
    {
      rel: 'icon',
      href: `${basePath}-16x16.png`,
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      href: `${basePath}-32x32.png`,
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'apple-touch-icon',
      href: `${basePath}-180x180.png`,
      sizes: '180x180',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
  ]
}

/**
 * Validate SEO configuration
 */
export function validateSEOConfig(seo: any): {
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
 * Clean metadata object by removing undefined values
 */
function cleanMetadata(metadata: Metadata): Metadata {
  return JSON.parse(
    JSON.stringify(metadata, (key, value) => {
      if (value === undefined) return undefined
      if (Array.isArray(value) && value.length === 0) return undefined
      if (
        typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length === 0
      )
        return undefined
      return value
    }),
  )
}

/**
 * Generate robots.txt content based on tenant configuration
 */
export function generateRobotsTxt(config: TenantConfig): string {
  const seo = config.metadata.seo
  const baseUrl = seo?.canonicalBase || 'https://example.com'

  return `User-agent: *
${seo?.robots === 'noindex, nofollow' ? 'Disallow: /' : 'Allow: /'}

Sitemap: ${baseUrl}/sitemap.xml`
}
