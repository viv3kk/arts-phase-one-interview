/**
 * Product Price Component
 * Displays current price, original price, and savings
 */

import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductPrice() {
  const { product } = useProductDetailUI()

  if (!product) return null

  const discountPrice =
    product.price - (product.price * product.discountPercentage) / 100
  const isOnSale = product.discountPercentage > 0

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <span className='text-3xl font-bold text-foreground'>
          ${discountPrice.toFixed(2)}
        </span>
        {isOnSale && (
          <span className='text-xl text-muted-foreground line-through'>
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>
      {isOnSale && (
        <p className='text-sm text-green-600 font-medium'>
          You save ${(product.price - discountPrice).toFixed(2)}!
        </p>
      )}
    </div>
  )
}
