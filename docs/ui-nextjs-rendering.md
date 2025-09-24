<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Next.js App Router with React Query \& Zustand: Best Practices and Strategy Guide

_For Modern SSR, SSG, ISR Implementations_

---

## 1. **Concept Overview**

### **Rendering Strategies**

- **SSG (Static Site Generation):** Pre-renders pages at build time. Best for static content.
- **SSR (Server-Side Rendering):** Renders pages at request time, always fresh. Best for personalized or frequently-changing content.
- **ISR (Incremental Static Regeneration):** Like SSG, but regenerates pages in the background at intervals (`revalidate`). Best for content that periodically changes.

### **Key Libraries**

- **React Query:** Handles client-side data caching, background updates, and hydration for “query” data.
- **Zustand:** Lightweight client-side store (with optional persisting), ideal for UI state, session, cart, preference, etc. Manages state across navigations and after hydration.

### **Rehydration Definitions**

- **React Hydration:** Client JS takes over static HTML, making components interactive.
- **Zustand Rehydration:** Zustand restores persisted state (e.g., from `localStorage`).
- **React Query Hydration:** React Query reuses initial cache seeded from server, eliminating waterfalls and duplicative API requests on first render.

---

## 2. **Provider Wrapping**

- Always wrap your **root layout (`app/layout.tsx`)** with the **React Query Provider** (and any other top-level providers, e.g., Zustand, Theme, Auth)—so that _any page/component_ can access the context and shared query cache.
- This enables mixing and matching techniques (SSG with React Query hydration, SSR with direct prop passing, etc.) without additional setup.

```typescript
// app/layout.tsx
import { Providers } from '@/lib/providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

```typescript
// lib/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient(/* SSR-friendly config */))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* optional devtools */}
    </QueryClientProvider>
  )
}
```

---

## 3. **Pattern Examples for Each Rendering Mode**

### **SSG Example (React Query Hydration + Zustand)**

```typescript
// app/cars/[carId]/page.tsx
import { getCar, getAllCarIds } from '@/lib/services/cars'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

export async function generateStaticParams() {
  const carIds = await getAllCarIds()
  return carIds.map((id) => ({ carId: id }))
}

export default async function CarDetailPage({ params }) {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['car', params.carId],
    queryFn: () => getCar(params.carId),
  })
  const car = await getCar(params.carId)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CarDetailClient carId={params.carId} initialCar={car} />
    </HydrationBoundary>
  )
}
```

```typescript
// components/CarDetailClient.tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/lib/stores/cart-store'
import { useHydration } from '@/lib/hooks/useHydration'

export function CarDetailClient({ carId, initialCar }) {
  const hasHydrated = useHydration()
  const { addToCart, items } = useCartStore()
  const { data: car, isLoading } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => getCar(carId),
    initialData: initialCar,
    enabled: hasHydrated,
    staleTime: 600_000,
  })

  // Immediate SEO & basic UX, then enhance after hydration
  if (!hasHydrated) return /* basic fallback/buttons */
  // Enhanced UI...
}
```

---

### **SSR Example (Direct Next.js + Zustand)**

```typescript
// app/dashboard/page.tsx
import { getCurrentUser, getUserBookings } from '@/lib/services/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser({ cache: 'no-store' })
  if (!user) redirect('/login')
  const bookings = await getUserBookings(user.id, { cache: 'no-store' })
  return (
    <DashboardClient initialUser={user} initialBookings={bookings} />
  )
}
export const dynamic = 'force-dynamic'
```

```typescript
// components/DashboardClient.tsx
'use client'
import { useEffect } from 'react'
import { useAuthStore, useBookingsStore } from '@/lib/stores/...
import { useHydration } from '@/lib/hooks/useHydration'
import { useQuery } from '@tanstack/react-query'

export function DashboardClient({ initialUser, initialBookings }) {
  const hasHydrated = useHydration()
  const { setUser, user } = useAuthStore()
  const { setBookings, bookings } = useBookingsStore()

  useEffect(() => {
    if (hasHydrated) {
      setUser(initialUser)
      setBookings(initialBookings)
    }
  }, [hasHydrated, initialUser, initialBookings])

  // Optionally manage updates with React Query, or just render
  const { data: latestBookings } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => getUserBookings(user?.id),
    initialData: initialBookings,
    enabled: hasHydrated && !!user,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
  // Render bookings
}
```

---

### **ISR Example (React Query Hydration + Client Enhancement)**

```typescript
// app/cars/page.tsx
import { getCars } from '@/lib/services/cars'

export default async function CarsPage({ searchParams }) {
  const cars = await getCars({
    ...searchParams,
    cache: 'force-cache', next: { revalidate: 600 }
  })
  return <CarsGridISR initialCars={cars} searchParams={searchParams} />
}
export const revalidate = 600
```

```typescript
// components/CarsGridISR.tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { useHydration } from '@/lib/hooks/useHydration'

export function CarsGridISR({ initialCars, searchParams }) {
  const hasHydrated = useHydration()
  const { data: cars } = useQuery({
    queryKey: ['cars', searchParams],
    queryFn: () => getCars(searchParams),
    initialData: initialCars,
    enabled: hasHydrated,
    staleTime: 300_000,
  })
  // Render car list: progressive enhancement
}
```

---

## 4. **Best Practices**

### **Provider Placement**

- Wrap your app’s root layout with your state providers (React Query, Zustand, Theme etc.).
- Never "conditionally" wrap; always be consistent.

### **Hydration**

- Use a `useHydration` hook to gate client-side reactivity \& Zustand/React Query features based on hydration state.
- Only trigger queries, actions, or state that require client context after hydration is true.

### **Data Prefetching \& Caching**

- SSG/ISR: Prefetch data on server, hydrate cache via React Query, then progressively enhance.
- SSR: Fetch directly in server component, then optionally manage live client updates via React Query.
- Use correct cache settings (`cache: 'force-cache'`, `'no-store'`, `revalidate` prop) tailored to your expected data volatility and SEO needs.

### **Progressive Enhancement**

- Always ensure pages render complete, useful content without JS.
- Enhance with interactive features, richer UX, and up-to-date data after hydration with Zustand/React Query.

### **Zustand Integration**

- Store UI, session, and ephemeral state client-side. Hydrate with server-provided values after hydration if needed.
- Use Zustand’s `persist` middleware when you want session or cart state to survive reloads.

### **React Query Integration**

- Use React Query's hydration (via `HydrationBoundary`) to seed SSR/SSG/ISR data and minimize waterfalls.
- Use `initialData` or hydration only when data matches what was returned from the server at render.

### **Mutations**

- Prefer Next.js **Server Actions** for server-side mutations but not for data fetching.
- Use React Query's mutations for optimistic UI and to trigger refetches/revalidations on the client as needed.

### **Code Organization**

- Server Components: Data-fetching, SEO, building the HTML shell.
- Client Components: Interactive features using Zustand and React Query, progressive updates.

---

## 5. **Summary Table**

| Scenario           | Data Fetching                    | React Query                         | Zustand                | Cache Config                |
| :----------------- | :------------------------------- | :---------------------------------- | :--------------------- | :-------------------------- |
| SSG Page           | Server fetch at build time       | Hydrate with `initialData` or cache | Cart/UI state hydrate  | `force-cache`               |
| SSR Page           | Server fetch at request          | Live update with `initialData`      | Session/UI state       | `no-store`, `force-dynamic` |
| ISR Page           | Server fetch + periodic rebuilds | Hydrate, refetch as needed          | Filters/UI enhancement | `force-cache`, `revalidate` |
| Mutations (writes) | Server Actions                   | Use mutations for UI feedback       | Client sync            | -                           |

---

## 6. **Patterns to Avoid**

- **Multiple QueryClientProviders or store providers** at different places—use a single, top-level provider.
- **Triggering client-side React Query fetches before hydration**; this can cause hydration mismatches.
- **Using Server Actions for just querying data**; reserve those for mutations/business logic only.

---

## 7. **Progressive Enhancement Example Pattern**

```typescript
// Client Component Template
'use client'
export function MyComponent({ initialData }) {
  const hasHydrated = useHydration()
  const { data, isLoading } = useQuery({
    queryKey: [...],
    queryFn: fetchFn,
    initialData,
    enabled: hasHydrated,
    staleTime: 5 * 60 * 1000,
  })
  if (!hasHydrated) return <StaticShell data={initialData} />
  return <EnhancedShell data={data} />
}
```

---

## 8. **Conclusion**

With this structure:

- You get optimal SEO, instant first paint, fast navigation, and enrich the user experience after hydration.
- Your codebase is simpler, more consistent, and easier to reason about.
- You can mix and match strategies as needed—**without sacrificing best practices—**across your Next.js project.

**Reference these patterns and guidelines as the foundation of a modern, flexible, and high-performance Next.js app architecture.**
