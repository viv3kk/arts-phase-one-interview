/**
 * Product Detail Content Component
 * Main content area with images and information
 */

import { ProductImages } from './ProductImages/ProductImages'
import { ProductInformation } from './ProductInformation/ProductInformation'

export function ProductDetailContent() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      <ProductImages />
      <ProductInformation />
    </div>
  )
}
