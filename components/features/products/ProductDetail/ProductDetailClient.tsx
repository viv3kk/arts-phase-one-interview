/**
 * Product Detail Client Component
 * Main orchestrator using composition pattern with React Query + Minimal Context
 */

'use client'

import { useProduct } from '@/lib/services/hooks'
import { ProductDetailUIProvider } from './context/ProductDetailUIProvider'
import { ProductDetailLayout } from './ProductDetailLayout'
import { ProductDetailHeader } from './ProductDetailHeader'
import { ProductDetailContent } from './ProductDetailContent'
import { ProductReviews } from './ProductReviews/ProductReviews'
import { ProductDetailSkeleton } from './ProductDetailSkeleton'
import { ProductNotFound } from './ProductNotFound'

interface ProductDetailClientProps {
  productId: number
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { product, isLoading, error } = useProduct(productId)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error || !product) {
    return <ProductNotFound />
  }

  return (
    <ProductDetailUIProvider product={product}>
      <ProductDetailLayout>
        <ProductDetailHeader />
        <ProductDetailContent />
        <ProductReviews />
      </ProductDetailLayout>
    </ProductDetailUIProvider>
  )
}
