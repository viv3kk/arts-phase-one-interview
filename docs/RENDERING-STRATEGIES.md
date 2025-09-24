# Rendering Strategies Guide

## Overview

This guide helps developers choose the right rendering strategy for different parts of a multi-tenant application. We'll cover **SSR** (Server-Side Rendering), **SSG** (Static Site Generation), and **ISR** (Incremental Static Regeneration).

## Quick Decision Matrix

| Content Type         | User Data | Update Frequency | Recommended Strategy |
| -------------------- | --------- | ---------------- | -------------------- |
| Marketing pages      | No        | Rarely           | **SSG**              |
| Product catalog      | No        | Daily/Weekly     | **ISR**              |
| User dashboard       | Yes       | Real-time        | **SSR**              |
| Blog posts           | No        | Occasionally     | **ISR**              |
| Shopping cart        | Yes       | Real-time        | **SSR**              |
| Tenant landing pages | No        | Monthly          | **ISR**              |

## Strategy Deep Dive

### 🏗️ SSG (Static Site Generation)

**Best for**: Content that rarely changes and doesn't depend on user data.

#### When to Use SSG

✅ **Perfect for:**

- Marketing landing pages
- About us pages
- Terms of service
- Privacy policy
- Static documentation
- Company information

❌ **Avoid for:**

- User-specific content
- Real-time data
- Frequently changing content
- Dynamic forms with server interaction

#### Implementation

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Our Company</h1>
      <p>Static content that rarely changes</p>
    </div>
  )
}

// No special configuration needed - Next.js will statically generate by default
```

#### Build-time Generation

```bash
# Pages are generated at build time
npm run build

# Results in static HTML files:
# - /about.html
# - /privacy.html
# - /terms.html
```

### ⚡ ISR (Incremental Static Regeneration)

**Best for**: Content that changes periodically but can be cached for performance.

#### When to Use ISR

✅ **Perfect for:**

- Product catalogs
- Blog posts
- News articles
- Tenant-specific landing pages
- Pricing pages
- FAQ sections

❌ **Avoid for:**

- User authentication pages
- Real-time dashboards
- Shopping carts
- Form submissions

#### Implementation

```tsx
// app/products/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <div>
      <h1>Our Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

#### Advanced ISR with generateStaticParams

```tsx
// app/tenant/[tenantId]/page.tsx
export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const tenants = await getAllActiveTenants()

  return tenants.map(tenant => ({
    tenantId: tenant.id,
  }))
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const config = await getTenantConfig(tenantId)

  return (
    <div>
      <h1>{config.name}</h1>
      <p>{config.description}</p>
    </div>
  )
}
```

#### On-Demand Revalidation

```tsx
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true })
  }

  return Response.json({ message: 'Missing path' }, { status: 400 })
}
```

```bash
# Trigger revalidation
curl -X POST "http://localhost:3000/api/revalidate?path=/products&secret=your-secret"
```

### 🔄 SSR (Server-Side Rendering)

**Best for**: Dynamic content that depends on user data or real-time information.

#### When to Use SSR

✅ **Perfect for:**

- User dashboards
- Shopping carts
- Account pages
- Search results
- Real-time data displays
- Personalized content

❌ **Avoid for:**

- Static marketing pages
- Rarely changing content
- Heavy computational pages (consider ISR)

#### Implementation

```tsx
// app/dashboard/page.tsx
import { headers } from 'next/headers'

export default async function DashboardPage() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')

  // This runs on every request
  const userData = await fetchUserData(userId)
  const recentActivity = await fetchRecentActivity(userId)

  return (
    <div>
      <h1>Welcome back, {userData.name}!</h1>
      <RecentActivity activities={recentActivity} />
      <UserStats stats={userData.stats} />
    </div>
  )
}
```

#### Force Dynamic Rendering

```tsx
// app/cart/page.tsx
export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const session = await getSession()
  const cartItems = await getCartItems(session.userId)

  return (
    <div>
      <h1>Your Cart</h1>
      <CartItems items={cartItems} />
    </div>
  )
}
```

## Multi-Tenant Specific Strategies

### Tenant Landing Pages (ISR)

```tsx
// app/page.tsx - Main tenant page
export const revalidate = 3600 // 1 hour cache

export default async function TenantHomePage() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const config = await getTenantConfig(tenantId)

  return (
    <main>
      <HeroSection
        headline={config.content.hero.headline}
        description={config.content.hero.description}
      />
      <FeaturesSection features={config.content.features} />
    </main>
  )
}
```

### User-Specific Pages (SSR)

```tsx
// app/bookings/page.tsx
import { headers } from 'next/headers'

export default async function BookingsPage() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const userId = headersList.get('x-user-id')

  // Dynamic content that must be fresh
  const bookings = await getUserBookings(userId, tenantId)

  return (
    <div>
      <h1>Your Bookings</h1>
      <BookingsList bookings={bookings} />
    </div>
  )
}
```

### Hybrid Approach

```tsx
// app/products/[category]/page.tsx
export const revalidate = 1800 // 30 minutes

export async function generateStaticParams() {
  const categories = await getProductCategories()
  return categories.map(category => ({ category: category.slug }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // ISR for product catalog
  const products = await getProductsByCategory(category, tenantId)

  return (
    <div>
      <h1>Products in {category}</h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

## Performance Optimization

### Cache Strategies

#### ISR Cache Configuration

```tsx
// next.config.js
module.exports = {
  experimental: {
    // Configure ISR cache
    swrDelta: 60, // 1 minute stale-while-revalidate
  },
  // Configure static generation
  generateBuildId: () => {
    return process.env.GIT_COMMIT_SHA || 'dev-build'
  },
}
```

#### Cache Tags for Advanced Invalidation

```tsx
// app/products/page.tsx
import { unstable_cache } from 'next/cache'

const getCachedProducts = unstable_cache(
  async (tenantId: string) => {
    return await fetchProducts(tenantId)
  },
  ['products'],
  {
    tags: ['products'],
    revalidate: 3600,
  },
)

export default async function ProductsPage() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const products = await getCachedProducts(tenantId)

  return <ProductGrid products={products} />
}
```

```tsx
// app/api/products/route.ts
import { revalidateTag } from 'next/cache'

export async function POST() {
  // After updating products
  revalidateTag('products')
  return Response.json({ success: true })
}
```

### Loading States

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className='space-y-4'>
      <div className='h-8 bg-gray-200 rounded animate-pulse' />
      <div className='grid grid-cols-2 gap-4'>
        <div className='h-32 bg-gray-200 rounded animate-pulse' />
        <div className='h-32 bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  )
}
```

### Error Boundaries

```tsx
// app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='text-center py-10'>
      <h2>Something went wrong!</h2>
      <button
        onClick={reset}
        className='mt-4 px-4 py-2 bg-primary text-white rounded'
      >
        Try again
      </button>
    </div>
  )
}
```

## Implementation Checklist

### For SSG Pages

- [ ] Content is static and rarely changes
- [ ] No user-specific data required
- [ ] No dynamic server-side logic needed
- [ ] Performance is critical
- [ ] SEO is important

### For ISR Pages

- [ ] Content changes periodically (hourly/daily)
- [ ] Can tolerate slightly stale data
- [ ] Performance is important
- [ ] SEO is important
- [ ] Set appropriate `revalidate` time
- [ ] Implement revalidation API if needed
- [ ] Consider cache tags for selective invalidation

### For SSR Pages

- [ ] Content depends on user data
- [ ] Real-time data is required
- [ ] User authentication needed
- [ ] Dynamic server logic required
- [ ] Implement proper loading states
- [ ] Consider caching strategies
- [ ] Optimize database queries

## Migration Strategies

### From SSR to ISR

```tsx
// Before (SSR)
export default async function ProductPage() {
  const products = await fetchProducts() // Runs on every request
  return <ProductList products={products} />
}

// After (ISR)
export const revalidate = 3600 // Add this line

export default async function ProductPage() {
  const products = await fetchProducts() // Runs once per hour
  return <ProductList products={products} />
}
```

### From SSG to ISR

```tsx
// Before (SSG)
export async function getStaticProps() {
  const data = await fetchData()
  return { props: { data } }
}

// After (ISR - App Router)
export const revalidate = 3600

export default async function Page() {
  const data = await fetchData()
  return <Component data={data} />
}
```

## Monitoring and Analytics

### Performance Metrics

```tsx
// lib/analytics.ts
export function trackPageLoad(
  strategy: 'SSG' | 'ISR' | 'SSR',
  loadTime: number,
) {
  // Track performance by rendering strategy
  analytics.track('page_load', {
    strategy,
    loadTime,
    timestamp: Date.now(),
  })
}
```

### Cache Hit Rates

```tsx
// Monitor ISR cache effectiveness
export function trackCacheHit(path: string, isHit: boolean) {
  analytics.track('cache_hit', {
    path,
    isHit,
    timestamp: Date.now(),
  })
}
```

## Common Pitfalls

### 1. Over-using SSR

```tsx
// ❌ Bad - SSR for static content
export default async function AboutPage() {
  const companyInfo = await fetchCompanyInfo() // Static data
  return <About info={companyInfo} />
}

// ✅ Good - SSG for static content
export default function AboutPage() {
  const companyInfo = getStaticCompanyInfo()
  return <About info={companyInfo} />
}
```

### 2. Under-using ISR

```tsx
// ❌ Bad - SSR for semi-static data
export default async function BlogPage() {
  const posts = await fetchBlogPosts() // Updates daily
  return <BlogList posts={posts} />
}

// ✅ Good - ISR for semi-static data
export const revalidate = 3600

export default async function BlogPage() {
  const posts = await fetchBlogPosts()
  return <BlogList posts={posts} />
}
```

### 3. Incorrect Revalidate Times

```tsx
// ❌ Bad - Too frequent revalidation
export const revalidate = 10 // Every 10 seconds - too often!

// ❌ Bad - Too infrequent revalidation
export const revalidate = 86400 * 7 // Weekly - too long for dynamic content!

// ✅ Good - Appropriate timing
export const revalidate = 3600 // 1 hour - good balance
```

## Testing Strategies

### Testing ISR

```bash
# Test initial generation
curl http://localhost:3000/products

# Test revalidation
curl -X POST "http://localhost:3000/api/revalidate?path=/products&secret=test"

# Verify updated content
curl http://localhost:3000/products
```

### Testing SSR

```bash
# Test with different user contexts
curl -H "x-user-id: user123" http://localhost:3000/dashboard
curl -H "x-user-id: user456" http://localhost:3000/dashboard
```

### Performance Testing

```tsx
// Test page load times
const start = performance.now()
await fetch('/api/products')
const end = performance.now()
console.log(`Request took ${end - start} milliseconds`)
```

## Best Practices Summary

1. **Start with SSG** for static content
2. **Use ISR** for content that changes regularly but doesn't need real-time updates
3. **Reserve SSR** for truly dynamic, user-specific content
4. **Set appropriate revalidation times** based on content update frequency
5. **Implement proper loading and error states**
6. **Monitor cache hit rates** and adjust strategies accordingly
7. **Use cache tags** for selective invalidation
8. **Test all strategies** under realistic load conditions
