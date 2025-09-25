/**
 * Products Grid Component
 * Displays products in grid or list layout
 */

import { Product } from '@/lib/types/products.types'
import { ProductCard } from './ProductCard'
import { ProductsSkeleton } from './ProductsSkeleton'

interface ProductsGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
}

export function ProductsGrid({
  products,
  viewMode,
  isLoading,
}: ProductsGridProps) {
  if (isLoading) {
    return <ProductsSkeleton viewMode={viewMode} />
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  )
}
