/**
 * Product Detail Skeleton Component
 * Loading state for product detail page
 */

import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-10 w-32' />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Image Skeleton */}
        <div className='space-y-4'>
          <Skeleton className='aspect-square w-full' />
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='aspect-square' />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-20' />
            </div>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-4 w-16' />
          </div>

          <div className='space-y-2'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-4 w-24' />
          </div>

          <Skeleton className='h-4 w-20' />

          <div className='space-y-4'>
            <Skeleton className='h-12 w-full' />
            <div className='flex gap-3'>
              <Skeleton className='h-12 flex-1' />
              <Skeleton className='h-12 w-12' />
              <Skeleton className='h-12 w-12' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
