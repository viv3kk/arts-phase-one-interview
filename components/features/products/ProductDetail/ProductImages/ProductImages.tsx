/**
 * Product Images Container Component
 * Composes main image and thumbnails
 */

import { ProductMainImage } from './ProductMainImage'
import { ProductThumbnails } from './ProductThumbnails'

export function ProductImages() {
  return (
    <div className='space-y-4'>
      <ProductMainImage />
      <ProductThumbnails />
    </div>
  )
}
