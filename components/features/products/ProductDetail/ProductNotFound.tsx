/**
 * Product Not Found Component
 * Error state when product cannot be found
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ProductNotFound() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-destructive mb-2'>
            Product Not Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            The requested product could not be found.
          </p>
          <Button asChild>
            <Link href='/products'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Products
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
