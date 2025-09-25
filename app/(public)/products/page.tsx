/**
 * Products Listing Page
 * Server-side rendered with ISR for optimal performance
 */

import { ProductsListingClient } from '@/components/features/products/ProductListing/ProductsListingClient'
// Unused imports removed
import { productsService } from '@/lib/services'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function ProductsPage() {
  const queryClient = new QueryClient()

  // Prefetch first page of products on server
  await queryClient.prefetchQuery({
    queryKey: ['products', 'list', { page: 1, limit: 12 }],
    queryFn: () => productsService.getProducts({ page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Prefetch categories for filtering
  await queryClient.prefetchQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Products</h1>
        <p className='text-muted-foreground'>
          Discover our wide range of products with advanced filtering and search
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsListingClient />
      </HydrationBoundary>
    </div>
  )
}

export const metadata = {
  title: 'Products | Store',
  description:
    'Browse our complete collection of products with advanced filtering and search capabilities.',
}
