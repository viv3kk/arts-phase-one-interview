/**
 * Product Detail Header Component
 * Back button and navigation
 */

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ProductDetailHeader() {
  return (
    <Button variant='outline' asChild>
      <Link href='/products'>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back to Products
      </Link>
    </Button>
  )
}
