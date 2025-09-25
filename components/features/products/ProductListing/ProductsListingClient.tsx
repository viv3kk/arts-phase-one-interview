/**
 * Products Listing Client Component
 * Main orchestrator using composition pattern for product listing
 */

'use client'

import { useProductsListing } from '@/lib/services/hooks'
import { useState } from 'react'
import {
  ProductFilters,
  ProductsGrid,
  ProductPagination,
  ResultsHeader,
  ErrorState,
} from './'

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
  const [searchQuery, setSearchQuery] = useState(initialParams?.search || '')
  const [selectedCategory, setSelectedCategory] = useState(
    initialParams?.category || 'all',
  )
  const [sortBy, setSortBy] = useState(initialParams?.sortBy || 'title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    initialParams?.order || 'asc',
  )
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
    updateParams,
  } = useProductsListing({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 12,
    search: searchQuery,
    category: selectedCategory,
    sortBy,
    order: sortOrder,
  })

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    updateParams({ search: query })
  }

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateParams({ category: category === 'all' ? undefined : category })
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    setSortBy(field)
    updateParams({ sortBy: field })
  }

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order)
    updateParams({ order })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('title')
    setSortOrder('asc')
    updateParams({
      search: undefined,
      category: undefined,
      sortBy: 'title',
      order: 'asc',
    })
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className='space-y-6'>
      {/* TODO: Add filters */}
      {/* <ProductFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
        total={total}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onOrderChange={handleOrderChange}
        onClearFilters={clearFilters}
      /> */}

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
