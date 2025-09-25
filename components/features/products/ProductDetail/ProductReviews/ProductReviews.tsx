/**
 * Product Reviews Container Component
 * Displays customer reviews if available
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductDetailUI } from '../hooks/useProductDetailUI'
import { ProductReviewItem } from './ProductReviewItem'

export function ProductReviews() {
  const { product } = useProductDetailUI()

  if (!product || !product.reviews || product.reviews.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {product.reviews.map((review, index) => (
            <ProductReviewItem key={index} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
