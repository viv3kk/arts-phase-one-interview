'use client'

import { LOADING_MESSAGES, LOADING_TIMINGS } from '@/constants/onboarding'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const loadingTexts = [
  LOADING_MESSAGES.CHECKING_STRIPE_IDENTITY,
  LOADING_MESSAGES.CHECKING_DRIVING_LICENSE,
  LOADING_MESSAGES.CHECKING_INSURANCE,
]

export function LoadingStep() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentTextIndex(prev => (prev + 1) % loadingTexts.length)
        setIsVisible(true)
      }, LOADING_TIMINGS.FADE_TRANSITION_DELAY)
    }, LOADING_TIMINGS.TEXT_CYCLE_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='mx-auto max-w-[568px]'>
      {/* Icon */}
      <div className='flex justify-center'>
        <div className='w-16 h-16 rounded-full flex items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      </div>

      {/* Main Content */}
      <div className='text-center'>
        <div className='space-y-4'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Setting up your account
          </h1>

          <div className='h-8 flex items-center justify-center'>
            <p
              className={`text-muted-foreground transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {loadingTexts[currentTextIndex]}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-4 text-left mt-6'>
          <p className='text-muted-foreground leading-relaxed text-center'>
            {LOADING_MESSAGES.SETTING_UP_ACCOUNT}
          </p>
        </div>
      </div>
    </div>
  )
}
