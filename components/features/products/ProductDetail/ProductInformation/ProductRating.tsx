/**
 * Product Rating Component
 * Displays star rating and review count
 */

import { Star } from 'lucide-react'
import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductRating() {
  const { product } = useProductDetailUI()

  if (!product) return null

  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center gap-1'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(product.rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className='text-sm text-muted-foreground'>
        {product.rating} ({product.reviews?.length || 0} reviews)
      </span>
    </div>
  )
}
