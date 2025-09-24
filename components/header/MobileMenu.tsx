'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/providers/StoreProvider'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { openLoginModal, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogin = useCallback(() => {
    openLoginModal(() => {
      router.push('/dashboard')
    })
  }, [openLoginModal, router])

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
                href='/find-cars'
                className='text-sm font-medium hover:underline py-2'
              >
                Find Cars
              </Link>
              <Link
                href='/bookings'
                className='text-sm font-medium hover:underline py-2'
              >
                Bookings
              </Link>
            </nav>

            <div className='border-t border-gray-200 my-2' />

            <div className='flex flex-col gap-2'>
              {isAuthenticated ? (
                <Link
                  href='/dashboard'
                  className='text-sm font-medium hover:underline py-2'
                >
                  Dashboard
                </Link>
              ) : (
                <Button
                  variant='ghost'
                  size='sm'
                  className='justify-start'
                  onClick={handleLogin}
                >
                  Log in
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
