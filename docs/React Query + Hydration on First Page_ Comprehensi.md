<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# React Query + Hydration on First Page: Comprehensive Implementation Guide for Next.js App Router (v15+)

This guide explains how to integrate React Query with data prefetching and hydration using Next.js App Router for seamless server-side rendering (SSR/ISR) and client-side caching. It assumes usage of a custom service layer for API calls, without Next.js API routes or Server Actions.

---

## Overview

- **Goal:** Pre-fetch server data during ISR/SSR, serialize React Query cache, hydrate on the client to avoid duplicate requests and enable background refetching.
- **Benefits:** Fast SEO-friendly first paint, consistent data across server and client, easy pagination, and smooth UI updates.

---

## Step 1: Wrap Your App with React Query Provider

Ensure the entire app is wrapped at the root with React Query’s provider to enable shared cache.

```tsx
// app/layout.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang='en'>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* Optional: <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

---

## Step 2: Create Your Service Layer Fetch Function

Centralize API calls in service functions, used both server and client side.

```ts
// lib/services/products.ts
export async function fetchProducts(page: number) {
  const res = await fetch(`https://api.example.com/products?page=${page}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
```

---

## Step 3: Server-Side Prefetch + Hydration Boundary

In your ISR/SSR Server Component, prefetch data and dehydrate cache to pass to client.

```tsx
// app/products/page.tsx
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { fetchProducts } from '@/lib/services/products'

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function ProductsPage() {
  const queryClient = new QueryClient()

  // Prefetch first page data on server
  await queryClient.prefetchQuery(['products', 1], () => fetchProducts(1))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListClient page={1} />
    </HydrationBoundary>
  )
}
```

---

## Step 4: Client Component with React Query Hook

Hydrate cached data and continue client data fetching with React Query hooks.

```tsx
// components/ProductListClient.tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/services/products'

export function ProductListClient({ page }: { page: number }) {
  const [currentPage, setCurrentPage] = useState(page)

  const { data, isLoading, isFetching, error } = useQuery(
    ['products', currentPage],
    () => fetchProducts(currentPage),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes cache freshness
    },
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products.</div>

  return (
    <>
      <div className='products-grid'>
        {data.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(old => old + 1)}
        disabled={isFetching}
      >
        {isFetching ? 'Loading...' : 'Load More'}
      </button>
    </>
  )
}
```

---

## Optional Step 5: Handling Scroll Position and UI State

Use Zustand or React Context to store pagination, filters, and scroll position to restore UI state after navigation.

```ts
// lib/stores/uiStore.ts
import create from 'zustand'

interface UIState {
  scrollPosition: number
  setScrollPosition: (pos: number) => void
}

export const useUIStore = create<UIState>(set => ({
  scrollPosition: 0,
  setScrollPosition: pos => set(() => ({ scrollPosition: pos })),
}))
```

Use saved state to restore scroll position on remount.

---

## Best Practices

- Always wrap your root layout with `QueryClientProvider`.
- Prefetch only necessary queries in server components.
- Set an appropriate `revalidate` duration for ISR based on data volatility.
- Use `keepPreviousData` to provide smooth pagination.
- Handle loading and error states gracefully.
- Optionally manage ephemeral UI state with Zustand.
- Optimize cache freshness (`staleTime`) to balance performance and real-time needs.

---

## Summary

| Step                      | Purpose                               |
| :------------------------ | :------------------------------------ |
| Wrap root with Provider   | Provide React Query context           |
| Service layer fetch fn    | Single source of truth for API calls  |
| Prefetch + Hydration      | Avoid duplicate fetch, enable SSR/ISR |
| Client-side `useQuery`    | Hydrate cache, handle pagination      |
| Optional state management | Preserve UI/scroll/filter state       |

---

This approach gives a solid, maintainable foundation for building performant, SEO-optimized, fully reactive Next.js apps using React Query hydration combined with ISR/SSR data prefetching—all while reusing your existing service layer.
<span style="display:none">[^1][^2][^3][^4][^5][^6][^7][^8][^9]</span>

```
<div style="text-align: center">⁂</div>
```

[^1]: https://tanstack.com/query/v5/docs/react/guides/ssr

[^2]: https://tanstack.com/query/v5/docs/react/guides/advanced-ssr

[^3]: https://supabase.com/blog/react-query-nextjs-app-router-cache-helpers

[^4]: https://dev.to/rayenmabrouk/advanced-server-rendering-react-query-with-nextjs-app-router-bi7

[^5]: https://brockherion.dev/blog/posts/setting-up-and-using-react-query-in-nextjs/

[^6]: https://nextjs.org/docs/app/guides/caching

[^7]: https://tanstack.com/query/v4/docs/framework/react/guides/ssr

[^8]: https://faun.pub/from-setup-to-execution-the-most-accurate-tanstack-query-and-next-js-14-integration-guide-8e5aff6ee8ba

[^9]: https://www.youtube.com/watch?v=Z4L_UE0hVmo
