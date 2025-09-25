/**
 * Product Card Component
 * Displays individual product in grid or list view
 */

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types/products.types'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const discountPrice =
    product.price - (product.price * product.discountPercentage) / 100

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.id}`} className='block'>
        <Card className='hover:shadow-md transition-shadow cursor-pointer'>
          <CardContent className='p-4'>
            <div className='flex gap-4'>
              <div className='relative w-24 h-24 flex-shrink-0'>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className='object-cover rounded-md'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-lg truncate'>
                  {product.title}
                </h3>
                <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                  {product.description}
                </p>
                <div className='flex items-center gap-2 mb-2'>
                  <Badge variant='secondary'>{product.category}</Badge>
                  <Badge variant='outline'>{product.brand}</Badge>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-bold'>
                    ${discountPrice.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className='text-sm text-muted-foreground line-through'>
                        ${product.price.toFixed(2)}
                      </span>
                      <Badge variant='destructive'>
                        -{product.discountPercentage}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.id}`} className='block'>
      <Card className='hover:shadow-md transition-shadow cursor-pointer'>
        <CardContent className='p-4'>
          <div className='relative aspect-square mb-4'>
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className='object-cover rounded-md'
            />
            {product.discountPercentage > 0 && (
              <Badge variant='destructive' className='absolute top-2 right-2'>
                -{product.discountPercentage}%
              </Badge>
            )}
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-lg line-clamp-2'>
              {product.title}
            </h3>
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {product.description}
            </p>

            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                {product.category}
              </Badge>
              <Badge variant='outline' className='text-xs'>
                {product.brand}
              </Badge>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-lg font-bold'>
                ${discountPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className='text-sm text-muted-foreground line-through'>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>⭐ {product.rating}</span>
              <span>•</span>
              <span>{product.stock} in stock</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
