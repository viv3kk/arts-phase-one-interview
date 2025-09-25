/**
 * Product Title and Brand Component
 * Displays product title, brand, category, and description
 */

import { Badge } from '@/components/ui/badge'
import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductTitleAndBrand() {
  const { product } = useProductDetailUI()

  if (!product) return null

  return (
    <div>
      <div className='flex items-center gap-2 mb-2'>
        <Badge variant='secondary'>{product.brand}</Badge>
        <Badge variant='outline'>{product.category}</Badge>
      </div>
      <h1 className='text-3xl font-bold text-foreground mb-2'>
        {product.title}
      </h1>
      <p className='text-muted-foreground text-lg'>{product.description}</p>
    </div>
  )
}
