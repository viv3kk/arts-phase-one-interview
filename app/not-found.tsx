import { getTenantConfig } from '@/lib/tenant'
import { getMainUrl } from '@/lib/utils'
import { headers } from 'next/headers'
import Link from 'next/link'

/**
 * Tenant-aware 404 page
 * Shows different content based on whether user is on a tenant subdomain
 */
export default async function NotFound() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // If on a tenant subdomain, show tenant-specific 404
  if (tenantId) {
    try {
      const config = await getTenantConfig(tenantId)

      return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
          <div className='text-center px-4'>
            <div className='mb-8'>
              <h1
                className='text-6xl font-bold mb-4'
                style={{
                  color:
                    typeof config.theme === 'string'
                      ? undefined
                      : config.theme.primary,
                }}
              >
                404
              </h1>
              <h2 className='text-2xl font-semibold text-text mb-2'>
                Page Not Found
              </h2>
              <p className='text-muted max-w-md mx-auto'>
                The page you&apos;re looking for doesn&apos;t exist on{' '}
                {config.name}&apos;s website.
              </p>
            </div>

            <div className='space-y-4'>
              <Link
                href='/'
                className='inline-block px-6 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90'
                style={{
                  backgroundColor:
                    typeof config.theme === 'string'
                      ? undefined
                      : config.theme.primary,
                }}
              >
                Return to {config.name} Homepage
              </Link>

              <div className='text-sm text-muted'>
                <p>Looking for something specific?</p>
                <div className='mt-2 space-x-4'>
                  <Link
                    href='/vehicles'
                    className='text-primary hover:underline'
                  >
                    Browse Vehicles
                  </Link>
                  <Link
                    href='/contact'
                    className='text-primary hover:underline'
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error loading tenant config for 404 page:', error)
    }
  }

  // Default 404 for main domain or when tenant config fails
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center px-4'>
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            Page Not Found
          </h2>
          <p className='text-gray-600 max-w-md mx-auto'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href={getMainUrl()}
            className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Return to Main Site
          </Link>

          <div className='text-sm text-gray-500'>
            <p>Need help finding what you&apos;re looking for?</p>
            <Link
              href={getMainUrl('/contact')}
              className='text-blue-600 hover:underline mt-1 inline-block'
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
