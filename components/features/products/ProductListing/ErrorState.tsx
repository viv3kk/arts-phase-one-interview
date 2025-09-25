/**
 * Error State Component
 * Displays error message when products fail to load
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  error: Error
}

export function ErrorState({ error }: ErrorStateProps) {
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
