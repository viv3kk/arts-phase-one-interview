'use client'

/**
 * User Menu Component
 *
 * Dropdown menu for authenticated users containing navigation options.
 * Uses shadcn DropdownMenu for clean, accessible dropdown functionality.
 */

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function UserMenu() {
  // const { clearAuth } = useAuth()
  // const router = useRouter()
  const [open, setOpen] = useState(false)

  // const handleLogout = () => {
  //   clearAuth()
  //   setOpen(false)
  //   router.push('/')
  // }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          // variant='ghost'
          className='items-center space-x-2 rounded-full border border-gray-300 
          px-3 py-2 shadow-sm hover:shadow-md hidden md:flex'
        >
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 
                1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 
                01-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <div className='h-8 w-8 rounded-full bg-gray-500'>
            <svg
              className='h-full w-full rounded-full p-1.5 text-white'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-56 p-1'>
        <div className='space-y-1'>
          <Link
            href='/bookings'
            className='flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors'
            onClick={() => setOpen(false)}
          >
            <Calendar className='mr-2 h-4 w-4' />
            <span>My Bookings</span>
          </Link>
          <Link
            href='/profile'
            className='flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors'
            onClick={() => setOpen(false)}
          >
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </Link>
          {/* <div className='border-t border-gray-200 my-1' />
          <button
            onClick={handleLogout}
            className='flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Log out</span>
          </button> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}
