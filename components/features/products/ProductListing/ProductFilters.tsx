/**
 * Product Filters Component
 * Handles search, category, and sorting filters
 */

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
import { useProductCategories } from '@/lib/services/hooks'
import { Filter, Search } from 'lucide-react'

interface ProductFiltersProps {
  searchQuery: string
  selectedCategory: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  total: number
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (field: string) => void
  onOrderChange: (order: 'asc' | 'desc') => void
  onClearFilters: () => void
}

export function ProductFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  sortOrder,
  total,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onOrderChange,
  onClearFilters,
}: ProductFiltersProps) {
  const { categories, isLoading: isLoadingCategories } = useProductCategories()

  return (
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
              onChange={e => onSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Category Filter */}
          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
            <Select value={sortBy} onValueChange={onSortChange}>
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
            <Select value={sortOrder} onValueChange={onOrderChange}>
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
          <Button variant='outline' onClick={onClearFilters}>
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
  )
}
