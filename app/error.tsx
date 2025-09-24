'use client'

import { getMainUrl } from '@/lib/utils'
import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary for the application
 * Handles unexpected errors with tenant-aware messaging
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // errorTracker.captureException(error)
    }
  }, [error])

  // Check if we're on a tenant subdomain
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const isTenantSite = hostname.includes('.') && !hostname.startsWith('www.')

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center px-4 max-w-md mx-auto'>
        <div className='mb-8'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Something went wrong
          </h1>
          <p className='text-gray-600'>
            {isTenantSite
              ? "We're experiencing technical difficulties with this page."
              : 'An unexpected error occurred while loading the page.'}
          </p>
        </div>

        <div className='space-y-4'>
          <button
            onClick={reset}
            className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>

          <div className='space-y-2'>
            {isTenantSite ? (
              <>
                <Link href='/' className='block text-blue-600 hover:underline'>
                  Return to Homepage
                </Link>
                <Link
                  href='/vehicles'
                  className='block text-blue-600 hover:underline'
                >
                  Browse Vehicles
                </Link>
              </>
            ) : (
              <Link
                href={getMainUrl()}
                className='block text-blue-600 hover:underline'
              >
                Return to Main Site
              </Link>
            )}
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-8 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
              Error Details (Development)
            </summary>
            <pre className='mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto text-red-600'>
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
