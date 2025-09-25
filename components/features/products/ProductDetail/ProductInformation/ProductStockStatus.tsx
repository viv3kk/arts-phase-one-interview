/**
 * Product Stock Status Component
 * Displays stock availability with appropriate styling
 */

import { Badge } from '@/components/ui/badge'
import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductStockStatus() {
  const { product } = useProductDetailUI()

  if (!product) return null

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-muted-foreground'>Stock:</span>
      <Badge
        variant={
          product.stock > 10
            ? 'default'
            : product.stock > 0
              ? 'secondary'
              : 'destructive'
        }
      >
        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
      </Badge>
    </div>
  )
}
