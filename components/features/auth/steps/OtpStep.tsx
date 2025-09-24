/**
 * OTP Step Component
 * Handles OTP verification and resend functionality
 */
'use client'

import { Button } from '@/components/ui/button'
import OTPInputComponent from '@/components/ui/OTPInputComponent'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface OtpStepProps {
  phoneNumber: string
  otp: string
  onOtpChange: (otp: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  isLoading: boolean
  error?: string | null
}

export function OtpStep({
  phoneNumber,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onBack,
  isLoading,
  error,
}: OtpStepProps) {
  return (
    <div className='gap-0 overflow-hidden p-0 sm:max-w-[568px]'>
      <div className='p-6 text-center'>
        <div className='mb-8'>
          <h1 className='mb-4 text-[32px] leading-tight font-semibold text-foreground'>
            Confirm your phone number
          </h1>
          <p className='text-base text-muted-foreground'>
            Enter the 6-digit code sent to {phoneNumber}
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className='mb-8'>
            <OTPInputComponent
              value={otp}
              onChange={onOtpChange}
              maxLength={6}
            />
          </div>

          {error && (
            <div className='mb-4 text-sm text-red-500'>
              Sorry, we are not able to verify the code. Please make sure you
              enter the right mobile number and code.
            </div>
          )}

          <Button
            type='submit'
            // className={`mb-12 h-12 w-32 rounded-lg font-medium cursor-pointer ${
            //   otp.length === 6
            //     ? `${
            //         isLoading
            //           ? 'bg-[#DDDDDD]'
            //           : 'bg-[linear-gradient(90deg,#E61E4D_0%,#E31C5F_50%,#D70466_100%)]'
            //       } text-white`
            //     : 'bg-gray-300 text-gray-500'
            // }`}
            className='mb-12 h-12 w-32 rounded-lg font-medium cursor-pointer'
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? <LoadingSpinner size='sm' /> : 'Verify'}
          </Button>
        </form>

        <div className='space-y-4'>
          <p className='text-muted-foreground'>
            Didn&apos;t get a text?{' '}
            <Button
              variant='link'
              size='sm'
              className='h-auto p-0 text-sm font-semibold underline'
              onClick={onResend}
              disabled={isLoading}
            >
              Send again
            </Button>
          </p>

          <Button
            variant='link'
            size='sm'
            className='mx-auto h-auto p-0 text-sm font-semibold'
            onClick={onBack}
          >
            Choose a different option
          </Button>
        </div>
      </div>
    </div>
  )
}
