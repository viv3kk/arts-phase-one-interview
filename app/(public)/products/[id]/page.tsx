/**
 * Product Detail Page
 * Server-side rendered with ISR for optimal performance
 */

import { ProductDetailClient } from '@/components/features/products/ProductDetailClient'
// Unused imports removed
import { productsService } from '@/lib/services'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // Revalidate every hour (ISR)

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const productId = parseInt(id)

  if (isNaN(productId)) {
    notFound()
  }

  const queryClient = new QueryClient()

  try {
    // Prefetch product data on server
    await queryClient.prefetchQuery({
      queryKey: ['products', 'detail', productId],
      queryFn: () => productsService.getProduct(productId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  } catch {
    // If product doesn't exist, show 404
    notFound()
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetailClient productId={productId} />
      </HydrationBoundary>
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const productId = parseInt(id)

  try {
    const product = await productsService.getProduct(productId)

    return {
      title: `${product.title} | Store`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [product.thumbnail],
      },
    }
  } catch {
    return {
      title: 'Product Not Found | Store',
      description: 'The requested product could not be found.',
    }
  }
}
