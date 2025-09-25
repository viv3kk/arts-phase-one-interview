/**
 * Products Skeleton Component
 * Loading state for products listing with grid and list views
 */

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductsSkeletonProps {
  viewMode: 'grid' | 'list'
}

export function ProductsSkeleton({ viewMode }: ProductsSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className='p-4'>
              <div className='flex gap-4'>
                <Skeleton className='w-24 h-24' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-2/3' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i}>
          <CardContent className='p-4'>
            <Skeleton className='aspect-square w-full mb-4' />
            <div className='space-y-2'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
              <div className='flex gap-2'>
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-20' />
              </div>
              <Skeleton className='h-6 w-24' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
