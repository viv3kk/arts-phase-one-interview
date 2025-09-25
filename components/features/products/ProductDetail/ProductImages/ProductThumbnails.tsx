/**
 * Product Thumbnails Component
 * Displays thumbnail images for selection
 */

import { useProductDetailUI } from '../hooks/useProductDetailUI'
import Image from 'next/image'

export function ProductThumbnails() {
  const { product, selectedImage, setSelectedImage } = useProductDetailUI()

  if (!product || product.images.length <= 1) return null

  return (
    <div className='grid grid-cols-4 gap-2'>
      {product.images.slice(0, 4).map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
            selectedImage === index
              ? 'border-primary'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <Image
            src={image}
            alt={`${product.title} ${index + 1}`}
            fill
            className='object-cover'
          />
        </button>
      ))}
    </div>
  )
}
