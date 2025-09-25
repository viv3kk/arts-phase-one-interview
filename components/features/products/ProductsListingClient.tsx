/**
 * Products Listing Client Component
 * Handles client-side interactions, filtering, and pagination
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
// Separator removed - not used
import { useProductsListing, useProductCategories } from '@/lib/services/hooks'
import { Product } from '@/lib/types/products.types'
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

  // Get categories for filtering
  const { categories, isLoading: isLoadingCategories } = useProductCategories()

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
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-destructive mb-2'>
              Error Loading Products
            </h3>
            <p className='text-muted-foreground mb-4'>{error.message}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Search */}
          <div className='space-y-2'>
            <Label htmlFor='search'>Search Products</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='search'
                placeholder='Search products...'
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Category Filter */}
            <div className='space-y-2'>
              <Label htmlFor='category'>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {isLoadingCategories ? (
                    <SelectItem value='loading' disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    categories.map(category => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className='space-y-2'>
              <Label htmlFor='sortBy'>Sort By</Label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Title</SelectItem>
                  <SelectItem value='price'>Price</SelectItem>
                  <SelectItem value='rating'>Rating</SelectItem>
                  <SelectItem value='stock'>Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className='space-y-2'>
              <Label htmlFor='order'>Order</Label>
              <Select value={sortOrder} onValueChange={handleOrderChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='asc'>Ascending</SelectItem>
                  <SelectItem value='desc'>Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between'>
            <Button variant='outline' onClick={clearFilters}>
              Clear Filters
            </Button>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {total} products found
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-semibold'>Products</h2>
          <Badge variant='secondary'>{total} items</Badge>
        </div>

        {/* View Mode Toggle */}
        <div className='flex items-center gap-2'>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('grid')}
          >
            <Grid className='h-4 w-4' />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('list')}
          >
            <List className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <ProductsSkeleton viewMode={viewMode} />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
                  onClick={prevPage}
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
                        variant={
                          pageNum === currentPage ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => goToPage(pageNum)}
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
                  onClick={nextPage}
                  disabled={!hasNext}
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Product Card Component
interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
}

function ProductCard({ product, viewMode }: ProductCardProps) {
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

// Loading Skeleton Component
interface ProductsSkeletonProps {
  viewMode: 'grid' | 'list'
}

function ProductsSkeleton({ viewMode }: ProductsSkeletonProps) {
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
