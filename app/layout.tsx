import { TenantProvider } from '@/components/providers/TenantProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { getAllFontVariables } from '@/lib/fonts'
import { Providers } from '@/lib/providers/Providers'
import { getTenantConfig } from '@/lib/tenant'
import { generateTenantThemeCSS } from '@/lib/themes'
import {
  generateLocalBusinessStructuredData,
  generateTenantMetadata,
} from '@/lib/utils/seo-utils'
// import { isDevelopment } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

/**
 * Generate viewport configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6', // Will be overridden by tenant theme
}

/**
 * Generate metadata dynamically based on tenant configuration
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  try {
    const config = await getTenantConfig(tenantId)
    return generateTenantMetadata(config, '/')
  } catch (error) {
    console.error('Failed to generate metadata:', error)

    // Fallback metadata
    return {
      title: 'Car Rental Service',
      description: 'Reliable car rental services for your transportation needs',
      robots: 'index, follow',
      openGraph: {
        title: 'Car Rental Service',
        description:
          'Reliable car rental services for your transportation needs',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Car Rental Service',
        description:
          'Reliable car rental services for your transportation needs',
      },
    }
  }
}

/**
 * Root layout component with tenant providers and dynamic theming
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Load tenant configuration
  const config = await getTenantConfig(tenantId)

  // Generate theme styles for server-side rendering
  const themeStyles = generateTenantThemeCSS(config)

  // Generate structured data for SEO
  const structuredData = generateLocalBusinessStructuredData(config)

  // Get all font variables for this layout
  const fontVariables = getAllFontVariables()

  return (
    <html lang='en' className={fontVariables}>
      <head>
        {/* Inject tenant theme styles for initial page load */}
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />

        {/* Structured Data for SEO */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />

        {/* Tenant-specific favicon */}
        {config.metadata.seo?.favicon && (
          <link rel='icon' href={config.metadata.seo.favicon} />
        )}
      </head>
      <body>
        <NuqsAdapter>
          <Providers>
            <TenantProvider initialConfig={config}>
              <ThemeProvider>
                {children}

                {/* Development tools - only show in development */}
                {/* {isDevelopment() && <DevTools />} */}
              </ThemeProvider>
            </TenantProvider>
          </Providers>
        </NuqsAdapter>

        {/* Portal container for modals */}
        <div id='modal-root' />

        {/* Toast notifications */}
        <Toaster />
      </body>
    </html>
  )
}
