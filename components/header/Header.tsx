'use client'

import { useTenant } from '@/components/providers/TenantProvider'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/providers/StoreProvider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import MobileMenu from './MobileMenu'
import { UserMenu } from './UserMenu'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export default function Header({
  className,
  fixed = true,
  children,
  ...props
}: HeaderProps) {
  const { openLoginModal, isAuthenticated } = useAuth()
  const { config } = useTenant()
  const router = useRouter()

  const handleLogin = useCallback(() => {
    openLoginModal(() => {
      router.push('/dashboard')
    })
  }, [openLoginModal, router])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-white',
        fixed && 'header-fixed peer/header',
        className,
      )}
      {...props}
    >
      <div className='mx-auto flex h-20 max-w-screen-xl items-center justify-between px-6 lg:px-10'>
        {/* Logo */}
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
          <Link href='/find-cars'>
            <Button variant='ghost' size='sm'>
              Find Cars
            </Button>
          </Link>
        </nav>

        {/* Auth Section */}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button variant='ghost' size='sm' onClick={handleLogin}>
            Log in
          </Button>
        )}

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Custom children content */}
        {children}
      </div>
    </header>
  )
}
