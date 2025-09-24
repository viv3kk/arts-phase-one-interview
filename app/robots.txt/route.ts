import { getTenantConfig } from '@/lib/tenant'
import { generateRobotsTxt } from '@/lib/utils/seo-utils'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  try {
    const config = await getTenantConfig(tenantId)
    const robotsContent = generateRobotsTxt(config)

    return new Response(robotsContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Failed to generate robots.txt:', error)

    // Fallback robots.txt
    return new Response(
      `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600',
        },
      },
    )
  }
}
