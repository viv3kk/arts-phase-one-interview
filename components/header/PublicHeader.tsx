'use client'

import { useTenant } from '@/components/providers/TenantProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/providers/StoreProvider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import MobileMenu from './MobileMenu'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export default function PublicHeader({
  className,
  fixed = true,
  children,
  ...props
}: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const [cartBadgePulse, setCartBadgePulse] = useState(false)
  const [previousTotalItems, setPreviousTotalItems] = useState(0)
  const { totalItems, items } = useCart()
  const { config } = useTenant()

  // Debug cart state
  console.log('🛒 Header cart state:', { totalItems, itemsCount: items.length, items })

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-full',
        offset > 10 && fixed ? 'shadow-lg' : 'shadow-none',
        'bg-white/40 backdrop-blur-lg border-b border-slate-200',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex h-full max-w-screen-xl items-center justify-between px-6 lg:px-10',
          offset > 10 &&
            fixed &&
            'after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg ',
        )}
      >
        {/* Logo/Brand Section */}
        <Link href='/' className='flex items-center'>
          <svg
            className='h-8 w-8 text-primary'
            viewBox='0 0 32 32'
            fill='currentColor'
          >
            <path d='M16 1C7.163 1 0 8.163 0 17s7.163 16 16 16 16-7.163 16-16S24.837 1 16 1zm0 29C8.82 30 3 24.18 3 17S8.82 4 16 4s13 5.82 13 13-5.82 13-13 13z' />
            <path d='M16 8c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9zm0 16c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7z' />
          </svg>
          <span className='ml-2 text-xl font-semibold text-primary'>
            {config.name || 'Rental'}
          </span>
        </Link>

        {/* Navigation Section */}
        <nav className='hidden md:flex items-center gap-4 flex-1 ml-6'>
          <Link href='/products'>
            <Button variant='ghost' size='sm'>
              Products
            </Button>
          </Link>
          <Link href='/cart'>
            <Button variant='ghost' size='sm' className='relative'>
              <ShoppingCart className='h-4 w-4' />
              {totalItems > 0 && (
                <Badge 
                  variant='destructive' 
                  className={cn(
                    'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs transition-all duration-300',
                    cartBadgePulse && 'cart-badge-pulse bg-green-500'
                  )}
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>

        {/* Removed auth section - cart only */}

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Custom children content */}
        {children}
      </div>
    </header>
  )
}
