'use client'

/**
 * Action Buttons Component
 * Reusable component for primary and secondary action buttons
 */

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ActionButtonsProps {
  primaryText: string
  secondaryText: string
}

export function ActionButtons({
  primaryText,
  secondaryText,
}: ActionButtonsProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
      <Button asChild size='lg' className='px-8 py-3'>
        <Link href='/vehicles'>{primaryText}</Link>
      </Button>
      <Button variant='outline' size='lg' className='px-8 py-3'>
        {secondaryText}
      </Button>
    </div>
  )
}
