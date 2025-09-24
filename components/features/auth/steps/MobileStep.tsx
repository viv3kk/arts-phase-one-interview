/**
 * Mobile Step Component
 * Handles phone number input and country selection
 */
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COUNTRIES } from '@/constants/auth'
import { AppleIcon, GoogleIcon, MailIcon } from '@/lib/icons'
import { isPhoneNumberValid } from '@/lib/utils/onboarding-utils'
import Link from 'next/link'

interface LoginFormState {
  phoneNumber: string
  selectedCountry: string
  otp: string
  phoneSubmitted: boolean
  otpRequestId: string | null
}

interface MobileStepProps {
  formState: LoginFormState
  onFormUpdate: (updates: Partial<LoginFormState>) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onGoogleSignIn: () => Promise<void>
  isLoading: boolean
}

export function MobileStep({
  formState,
  onFormUpdate,
  onSubmit,
  onGoogleSignIn,
  isLoading,
}: MobileStepProps) {
  return (
    <div className='mx-auto max-w-[568px]'>
      <h1 className='mb-6 text-[22px] font-semibold text-foreground'>
        Welcome! Please Login
      </h1>

      <form onSubmit={onSubmit}>
        <div className='mb-4'>
          <Select
            value={formState.selectedCountry}
            onValueChange={value => onFormUpdate({ selectedCountry: value })}
          >
            <SelectTrigger
              size='lg'
              className='w-full rounded-t-lg rounded-b-none border border-border px-4 text-left focus-visible:ring-[1px] focus-visible:rounded-lg focus-visible:border-black focus-visible:outline-none focus:ring-0'
            >
              <div className='flex flex-col items-start justify-center h-full'>
                <span className='text-xs font-medium text-muted-foreground'>
                  Country/Region
                </span>
                <SelectValue className='text-base' />
              </div>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country: string) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='relative'>
            <Input
              id='phoneNumber'
              type='tel'
              value={formState.phoneNumber}
              onChange={e => onFormUpdate({ phoneNumber: e.target.value })}
              placeholder=' '
              className='peer h-14 w-full rounded-t-none rounded-b-lg border border-border px-4 pt-6 pb-2 placeholder-transparent outline-none focus-visible:border-black focus-visible:rounded-lg focus-visible:ring-[1px]'
              required
            />
            <label
              htmlFor='phoneNumber'
              className={`pointer-events-none absolute left-4 text-muted-foreground transition-all duration-150 ${
                formState.phoneNumber
                  ? 'top-3 text-xs'
                  : 'top-1/2 -translate-y-1 text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base'
              } peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs`}
            >
              Phone number
            </label>
          </div>
        </div>

        {/* <p className='mb-4 text-xs leading-relaxed text-muted-foreground'>
          We&apos;ll call or text you to confirm your number. Standard message
          and data rates apply.{' '}
          <Button
            variant='link'
            size='sm'
            className='h-auto p-0 text-xs font-semibold underline'
          >
            Privacy Policy
          </Button>
        </p> */}

        <Button
          type='submit'
          disabled={isLoading || !isPhoneNumberValid(formState.phoneNumber)}
          className='w-full cursor-pointer h-12'
          size='lg'
        >
          {isLoading ? <LoadingSpinner size='sm' /> : 'Send OTP'}
        </Button>

        <div className='my-2 flex items-center'>
          <div className='flex-1 border-t border-border' />
          <span className='px-4 text-xs text-muted-foreground'>or</span>
          <div className='flex-1 border-t border-border' />
        </div>

        <div className='space-y-3'>
          <Button
            type='button'
            variant='outline'
            size='lg'
            className='h-12 w-full justify-between focus:ring-1 focus:ring-ring focus:ring-offset-0 hover:bg-gray-100 cursor-pointer hover:text-black'
            onClick={onGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleIcon className='mr-3 h-5 w-5' />
            {isLoading ? 'Loading...' : 'Continue with Google'}
            <div />
          </Button>

          <Button
            variant='outline'
            size='lg'
            className='h-12 w-full justify-between focus:ring-1 focus:ring-ring focus:ring-offset-0 hover:bg-gray-100 cursor-pointer hover:text-black'
          >
            <AppleIcon className='mr-3 h-5 w-5' />
            Continue with Apple
            <div />
          </Button>

          <Link href='/login/email' className='block'>
            <Button
              variant='outline'
              size='lg'
              className='h-12 w-full justify-between focus:ring-1 focus:ring-ring focus:ring-offset-0 hover:bg-gray-100 cursor-pointer hover:text-black'
            >
              <MailIcon className='mr-3 h-5 w-5' />
              Continue with email
              <div />
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
