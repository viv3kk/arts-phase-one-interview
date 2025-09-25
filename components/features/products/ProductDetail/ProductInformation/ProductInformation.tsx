/**
 * Product Information Container Component
 * Composes all product information sections
 */

import { Separator } from '@/components/ui/separator'
import { ProductTitleAndBrand } from './ProductTitleAndBrand'
import { ProductRating } from './ProductRating'
import { ProductPrice } from './ProductPrice'
import { ProductStockStatus } from './ProductStockStatus'
import { ProductQuantityAndCart } from './ProductQuantityAndCart'
import { ProductDetails } from './ProductDetails'
import { ProductWarrantyAndShipping } from './ProductWarrantyAndShipping'

export function ProductInformation() {
  return (
    <div className='space-y-6'>
      <ProductTitleAndBrand />
      <ProductRating />
      <ProductPrice />
      <ProductStockStatus />
      <ProductQuantityAndCart />
      <Separator />
      <ProductDetails />
      <ProductWarrantyAndShipping />
    </div>
  )
}
