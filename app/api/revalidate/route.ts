import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint for cache invalidation and ISR revalidation
 * Usage: POST /api/revalidate with { tenantId?, path?, tag?, secret }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, path, tag, secret } = body

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate main page (subdomain approach doesn't need specific paths)
    if (tenantId) {
      revalidatePath('/')
      console.log(`Revalidated main page for tenant: ${tenantId}`)

      return NextResponse.json({
        revalidated: true,
        tenantId,
        timestamp: new Date().toISOString(),
      })
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)

      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: new Date().toISOString(),
      })
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)

      return NextResponse.json({
        revalidated: true,
        tag,
        timestamp: new Date().toISOString(),
      })
    }

    // Revalidate main page if no specific target
    revalidatePath('/')

    return NextResponse.json({
      revalidated: true,
      path: '/',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 },
    )
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'revalidation',
    timestamp: new Date().toISOString(),
  })
}
