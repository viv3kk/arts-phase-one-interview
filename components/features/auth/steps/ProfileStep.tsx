'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { INITIAL_PROFILE_FORM_STATE } from '@/constants/onboarding'
import { useRenterProfileFlow } from '@/lib/services/hooks/renter-hooks'
import type {
  ProfileFormState,
  ProfileStepProps,
} from '@/lib/types/onboarding.types'
import { processProfileFormData } from '@/lib/utils/onboarding-utils'
import { useState } from 'react'

export const ProfileStep = ({ onComplete }: ProfileStepProps) => {
  const { updateProfile, isLoading } = useRenterProfileFlow()
  const [formState, setFormState] = useState<ProfileFormState>(
    INITIAL_PROFILE_FORM_STATE,
  )

  const handleInputChange = (field: keyof ProfileFormState, value: string) => {
    setFormState({ ...formState, [field]: value })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const processedData = processProfileFormData(formState)
    try {
      const result = await updateProfile({
        name: processedData.name,
        email: processedData.email,
      })

      if (result.success) {
        onComplete()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className='mx-auto max-w-[568px]'>
      <form onSubmit={handleFormSubmit} className='space-y-4'>
        {/* First Name */}
        <div className='relative'>
          <Input
            id='firstName'
            type='text'
            value={formState.firstName}
            onChange={e => handleInputChange('firstName', e.target.value)}
            placeholder=' '
            className='peer h-14 w-full rounded-lg border border-gray-300 px-4 pt-6 pb-2 placeholder-transparent'
            required
            disabled={isLoading}
          />
          <label
            htmlFor='firstName'
            className={`pointer-events-none absolute left-4 text-gray-500 transition-all duration-150 ${
              formState.firstName
                ? 'top-3 text-xs'
                : 'top-3 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base'
            } peer-focus:top-3 peer-focus:text-xs`}
          >
            First Name
          </label>
        </div>

        {/* Last Name */}
        <div>
          <div className='relative'>
            <Input
              id='lastName'
              type='text'
              value={formState.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              placeholder=' '
              className='peer h-14 w-full rounded-lg border border-gray-300 px-4 pt-6 pb-2 placeholder-transparent'
              required
              disabled={isLoading}
            />
            <label
              htmlFor='lastName'
              className={`pointer-events-none absolute left-4 text-gray-500 transition-all duration-150 ${
                formState.lastName
                  ? 'top-3 text-xs'
                  : 'top-3 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base'
              } peer-focus:top-3 peer-focus:text-xs`}
            >
              Last Name
            </label>
          </div>
          <p className='mt-2 text-xs text-gray-600'>
            Please use your legal name as it appears on your ID
          </p>
        </div>

        {/* Email */}
        <div>
          <div className='relative'>
            <Input
              id='email'
              type='email'
              value={formState.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder=' '
              className='peer h-14 w-full rounded-lg border border-gray-300 px-4 pt-6 pb-2 placeholder-transparent'
              required
              disabled={isLoading}
            />
            <label
              htmlFor='email'
              className={`pointer-events-none absolute left-4 text-gray-500 transition-all duration-150 ${
                formState.email
                  ? 'top-3 text-xs'
                  : 'top-3 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base'
              } peer-focus:top-3 peer-focus:text-xs`}
            >
              Email Address
            </label>
          </div>
          <p className='mt-2 text-xs text-gray-600'>
            We&apos;ll use this to send you booking confirmations
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          className='h-12 w-full cursor-pointer rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60'
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size='sm' /> : 'Continue'}
        </Button>
      </form>
    </div>
  )
}
