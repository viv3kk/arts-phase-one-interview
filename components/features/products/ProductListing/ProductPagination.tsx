/**
 * Product Pagination Component
 * Handles pagination controls and page navigation
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  onNextPage: () => void
  onPrevPage: () => void
}

export function ProductPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  onNextPage,
  onPrevPage,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrevPage}
              disabled={!hasPrev}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum > totalPages) return null

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => onPageChange(pageNum)}
                    className='w-10'
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={onNextPage}
              disabled={!hasNext}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
