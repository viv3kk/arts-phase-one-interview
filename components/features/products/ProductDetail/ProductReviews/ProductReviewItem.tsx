/**
 * Product Review Item Component
 * Displays individual customer review
 */

import { Star } from 'lucide-react'
import { ClientDate } from './ClientDate'
import type { ProductReview } from '@/lib/types/products.types'

interface ProductReviewItemProps {
  review: ProductReview
}

export function ProductReviewItem({ review }: ProductReviewItemProps) {
  return (
    <div className='border-b pb-4 last:border-b-0'>
      <div className='flex items-center gap-2 mb-2'>
        <div className='flex items-center gap-1'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className='text-sm font-medium'>{review.reviewerName}</span>
        <span className='text-sm text-muted-foreground'>
          <ClientDate dateString={review.date} />
        </span>
      </div>
      <p className='text-sm text-muted-foreground'>{review.comment}</p>
    </div>
  )
}
