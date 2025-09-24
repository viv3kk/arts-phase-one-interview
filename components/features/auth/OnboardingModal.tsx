'use client'

import { BaseModal } from '@/components/ui/base-modal'
import { INITIAL_LOGIN_FORM_STATE } from '@/constants/onboarding'
import { useAuth, useRenter } from '@/lib/providers/StoreProvider'
import { useLoginFlow } from '@/lib/services/hooks/auth-hooks'
import type { Renter } from '@/lib/stores/slices/renter.slice'
import type {
  LoginFormState,
  OnboardingStep,
} from '@/lib/types/onboarding.types'
import { ONBOARDING_STEP } from '@/lib/types/onboarding.types'
import { useGoogleAuth } from '@/lib/utils/google-auth'
import {
  getOnboardingStep,
  getOnboardingStepTitle,
  getPreviousOnboardingStep,
} from '@/lib/utils/onboarding-utils'
import { useEffect, useState } from 'react'
import { LoadingStep, MobileStep, OtpStep, ProfileStep } from './steps'

export function OnboardingModal() {
  const { renterProfile } = useRenter()
  const {
    isModalOpen,
    closeLoginModal,
    isAuthenticated,
    error: authError,
    clearError,
    loginSuccessCallback,
  } = useAuth()
  const { sendOtp, verifyOtp, authenticateWithGoogle, isLoading } =
    useLoginFlow()
  const { signIn: googleSignIn } = useGoogleAuth()

  const [step, setStep] = useState<OnboardingStep>(ONBOARDING_STEP.MOBILE)

  const [formState, setFormState] = useState<LoginFormState>(
    INITIAL_LOGIN_FORM_STATE,
  )

  const updateFormState = (updates: Partial<LoginFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormState(INITIAL_LOGIN_FORM_STATE)
    setStep(ONBOARDING_STEP.MOBILE)
    clearError()
    loginSuccessCallback()
  }

  useEffect(() => {
    if (isAuthenticated) {
      const correctStep = getOnboardingStep(
        isAuthenticated,
        renterProfile as unknown as Renter,
      )
      if (correctStep) {
        setStep(correctStep)
      } else {
        loginSuccessCallback()
      }
    }
  }, [isAuthenticated, isModalOpen, renterProfile, loginSuccessCallback])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.phoneNumber.trim()) return

    clearError()
    const result = await sendOtp(formState.phoneNumber.trim(), 'en')

    if (result.success) {
      setStep(ONBOARDING_STEP.OTP)
      updateFormState({ phoneSubmitted: true })
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.otp.trim()) return

    clearError()
    const result = await verifyOtp(formState.otp.trim())
    if (result.success) {
      console.log('OTP verified, moving to stripe step')
    }
  }

  const handleProfileComplete = async () => {
    resetForm()
  }

  const handleClose = () => {
    closeLoginModal()
  }

  const goBack = () => {
    const previousStep = getPreviousOnboardingStep(step)
    if (previousStep) {
      setStep(previousStep)
      if (previousStep === ONBOARDING_STEP.MOBILE) {
        updateFormState({ otp: '' })
      }
      clearError()
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      clearError()
      const result = await googleSignIn()

      if (result.success && result.user) {
        const authResult = await authenticateWithGoogle(result.user)
        if (authResult.success) {
          resetForm()
        }
      } else {
        if (result.error && result.error !== 'Google Sign-In was dismissed') {
          console.error('Google Sign-In error:', result.error)
        }
      }
    } catch (error) {
      console.error('Google authentication failed:', error)
    }
  }

  const handleResendOtp = async () => {
    clearError()
    const result = await sendOtp(formState.phoneNumber, 'en')
    if (result.success) {
      updateFormState({ otp: '' })
    }
  }

  const renderStep = () => {
    switch (step) {
      case ONBOARDING_STEP.MOBILE:
        return (
          <MobileStep
            formState={formState}
            onFormUpdate={updateFormState}
            onSubmit={handlePhoneSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading}
          />
        )

      case ONBOARDING_STEP.OTP:
        return (
          <OtpStep
            phoneNumber={formState.phoneNumber}
            otp={formState.otp}
            onOtpChange={otp => updateFormState({ otp })}
            onSubmit={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={goBack}
            isLoading={isLoading}
            error={authError}
          />
        )

      case ONBOARDING_STEP.PROFILE:
        return <ProfileStep onComplete={handleProfileComplete} />

      case ONBOARDING_STEP.LOADING:
        return <LoadingStep />

      default:
        return <LoadingStep /> // Fallback to loading for unknown states
    }
  }

  const getStepTitle = () => getOnboardingStepTitle(step)

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title={getStepTitle()}
      showCloseButton={true}
      showBackButton={false}
    >
      {renderStep()}
    </BaseModal>
  )
}
