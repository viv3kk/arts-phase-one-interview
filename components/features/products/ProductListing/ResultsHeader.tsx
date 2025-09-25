/**
 * Results Header Component
 * Displays results count and view mode toggle
 */

import { Badge } from '@/components/ui/badge'
import { ViewModeToggle } from './ViewModeToggle'

interface ResultsHeaderProps {
  total: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function ResultsHeader({
  total,
  viewMode,
  onViewModeChange,
}: ResultsHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <h2 className='text-xl font-semibold'>Products</h2>
        <Badge variant='secondary'>{total} items</Badge>
      </div>

      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  )
}
