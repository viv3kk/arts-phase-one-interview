'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/providers/StoreProvider'
import { cn } from '@/lib/utils'
import { Menu, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState, useEffect } from 'react'

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [cartBadgePulse, setCartBadgePulse] = useState(false)
  const [previousTotalItems, setPreviousTotalItems] = useState(0)
  const { totalItems, items } = useCart()

  // Debug cart state
  console.log('🛒 MobileMenu cart state:', {
    totalItems,
    itemsCount: items.length,
    items,
  })

  // Cart badge animation effect
  useEffect(() => {
    if (totalItems > previousTotalItems && totalItems > 0) {
      setCartBadgePulse(true)
      // Reset pulse after animation
      setTimeout(() => setCartBadgePulse(false), 1000)
    }
    setPreviousTotalItems(totalItems)
  }, [totalItems, previousTotalItems])

  // Removed auth functionality - cart only

  const toggleMenu = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  return (
    <div className='md:hidden'>
      <Button
        variant='ghost'
        size='icon'
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={toggleMenu}
        className='h-9 w-9'
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {open && (
        <div className='absolute top-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50'>
          <div className='mx-auto max-w-screen-xl px-6 py-4 flex flex-col gap-3'>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/products'
                className='text-sm font-medium hover:underline py-2'
              >
                Products
              </Link>
              <Link
                href='/cart'
                className='text-sm font-medium hover:underline py-2 flex items-center gap-2'
              >
                <ShoppingCart className='h-4 w-4' />
                Cart
                {totalItems > 0 && (
                  <Badge
                    variant='destructive'
                    className={cn(
                      'text-xs transition-all duration-300',
                      cartBadgePulse && 'cart-badge-pulse bg-green-500',
                    )}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </nav>

            <div className='border-t border-gray-200 my-2' />

            {/* Removed auth section - cart only */}
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
