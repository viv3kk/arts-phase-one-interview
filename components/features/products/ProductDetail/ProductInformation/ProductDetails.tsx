/**
 * Product Details Component
 * Displays technical product information (SKU, weight, dimensions)
 */

import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductDetails() {
  const { product } = useProductDetailUI()

  if (!product) return null

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Product Details</h3>
      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='text-muted-foreground'>SKU:</span>
          <span className='ml-2 font-medium'>{product.sku || 'N/A'}</span>
        </div>
        <div>
          <span className='text-muted-foreground'>Weight:</span>
          <span className='ml-2 font-medium'>{product.weight || 'N/A'} kg</span>
        </div>
        {product.dimensions && (
          <div className='col-span-2'>
            <span className='text-muted-foreground'>Dimensions:</span>
            <span className='ml-2 font-medium'>
              {product.dimensions.width} × {product.dimensions.height} ×{' '}
              {product.dimensions.depth} cm
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
