/**
 * Product Main Image Component
 * Displays the selected product image with sale badge
 */

import { Badge } from '@/components/ui/badge'
import { useProductDetailUI } from '../hooks/useProductDetailUI'
import Image from 'next/image'

export function ProductMainImage() {
  const { product, selectedImage } = useProductDetailUI()

  if (!product) return null

  const _discountPrice =
    product.price - (product.price * product.discountPercentage) / 100
  const isOnSale = product.discountPercentage > 0

  return (
    <div className='aspect-square relative overflow-hidden rounded-lg'>
      <Image
        src={product.images[selectedImage] || product.thumbnail}
        alt={product.title}
        fill
        className='object-cover'
        priority
      />
      {isOnSale && (
        <Badge variant='destructive' className='absolute top-4 left-4'>
          -{product.discountPercentage}% OFF
        </Badge>
      )}
    </div>
  )
}
