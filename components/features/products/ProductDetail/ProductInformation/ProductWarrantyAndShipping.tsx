/**
 * Product Warranty and Shipping Component
 * Displays warranty and shipping information
 */

import { Separator } from '@/components/ui/separator'
import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductWarrantyAndShipping() {
  const { product } = useProductDetailUI()

  if (
    !product ||
    (!product.warrantyInformation && !product.shippingInformation)
  ) {
    return null
  }

  return (
    <>
      <Separator />
      <div className='space-y-2'>
        {product.warrantyInformation && (
          <div>
            <span className='text-sm font-medium'>Warranty:</span>
            <span className='ml-2 text-sm text-muted-foreground'>
              {product.warrantyInformation}
            </span>
          </div>
        )}
        {product.shippingInformation && (
          <div>
            <span className='text-sm font-medium'>Shipping:</span>
            <span className='ml-2 text-sm text-muted-foreground'>
              {product.shippingInformation}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
