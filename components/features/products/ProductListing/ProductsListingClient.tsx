/**
 * Products Listing Client Component
 * Main orchestrator using composition pattern for product listing
 */

'use client'

import { useProductsListing } from '@/lib/services/hooks'
import { useState } from 'react'
import { ProductsGrid, ProductPagination, ResultsHeader, ErrorState } from './'

interface ProductsListingClientProps {
  initialParams?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    sortBy?: string
    order?: 'asc' | 'desc'
  }
}

export function ProductsListingClient({
  initialParams,
}: ProductsListingClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get products with current filters
  const {
    products,
    total,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    isLoading,
    error,
    goToPage,
    nextPage,
    prevPage,
  } = useProductsListing({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 12,
    search: initialParams?.search,
    category: initialParams?.category,
    sortBy: initialParams?.sortBy || 'title',
    order: initialParams?.order || 'asc',
  })

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className='space-y-6'>
      <ResultsHeader
        total={total}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ProductsGrid
        products={products}
        viewMode={viewMode}
        isLoading={isLoading}
      />

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  )
}
