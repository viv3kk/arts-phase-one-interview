/**
 * Onboarding utility functions
 * Handles step determination logic for the onboarding flow
 */

import { STEP_TITLES } from '@/constants/onboarding'
import type { Renter } from '@/lib/stores/slices/renter.slice'
import type { OnboardingStep } from '@/lib/types/onboarding.types'
import {
  IDENTITY_VERIFICATION_STATUS,
  ONBOARDING_STEP,
} from '@/lib/types/onboarding.types'

// ============================================================================
// STEP DETERMINATION UTILITIES
// ============================================================================

/**
 * Determines the appropriate onboarding step based on authentication status and renter profile
 *
 * @param isAuthenticated - Whether the user is authenticated
 * @param renterProfile - The renter profile data
 * @returns The onboarding step the user should be on
 */
export function getOnboardingStep(
  isAuthenticated: boolean,
  renterProfile: Renter | null,
): OnboardingStep | null {
  // Return null when completed
  if (!isAuthenticated) {
    return ONBOARDING_STEP.MOBILE
  }
  if (renterProfile) {
    const isProfileComplete = renterProfile.name && renterProfile.email
    if (!isProfileComplete) {
      return ONBOARDING_STEP.PROFILE
    }
    // Check if identity verification is complete
    if (
      renterProfile.identityVerificationStatus ===
      IDENTITY_VERIFICATION_STATUS.VERIFIED
    ) {
      // Check if driving license is uploaded and verified
      const hasDrivingLicense =
        renterProfile.driverLicense?.id &&
        renterProfile.driverLicense?.relativePath

      // Check if insurance is uploaded and verified
      const hasInsuranceDocument =
        renterProfile.insuranceDocument?.insuranceCard?.id &&
        renterProfile.insuranceDocument?.insuranceFile?.id

      // ✅ Check if ALL onboarding is complete
      if (hasDrivingLicense && hasInsuranceDocument) {
        // Check if insurance is actually verified (add verification status if needed)
        const isInsuranceVerified = renterProfile.insuranceDocument != null

        if (isInsuranceVerified) {
          return null // ✅ Onboarding complete - no more steps
        } else {
          return ONBOARDING_STEP.INSURANCE // Still need insurance verification
        }
      } else if (hasDrivingLicense) {
        return ONBOARDING_STEP.INSURANCE // Need insurance
      } else {
        return ONBOARDING_STEP.DRIVING_LICENSE // Need driving license
      }
    } else {
      return ONBOARDING_STEP.STRIPE // Need identity verification
    }
  }

  return ONBOARDING_STEP.LOADING
}

/**
 * Checks if a renter profile is complete (all verification steps done)
 *
 * @param renterProfile - The renter profile to check
 * @returns Whether the profile is complete
 */
export function isRenterProfileComplete(renterProfile: Renter | null): boolean {
  if (!renterProfile) {
    return false
  }

  return !!(
    renterProfile.identityVerificationStatus ===
      IDENTITY_VERIFICATION_STATUS.VERIFIED &&
    renterProfile.driverLicense &&
    renterProfile.driverLicense.id &&
    renterProfile.driverLicense.relativePath &&
    renterProfile.insuranceDocument &&
    renterProfile.insuranceDocument.insuranceFile &&
    renterProfile.insuranceDocument.insuranceFile.id
  )
}

// ============================================================================
// STEP NAVIGATION UTILITIES
// ============================================================================

/**
 * Gets the next step in the onboarding flow
 *
 * @param currentStep - The current onboarding step
 * @returns The next step, or null if at the end
 */
export function getNextOnboardingStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  switch (currentStep) {
    case ONBOARDING_STEP.MOBILE:
      return ONBOARDING_STEP.OTP
    case ONBOARDING_STEP.OTP:
      return ONBOARDING_STEP.PROFILE
    case ONBOARDING_STEP.PROFILE:
      return ONBOARDING_STEP.STRIPE
    case ONBOARDING_STEP.STRIPE:
      return ONBOARDING_STEP.DRIVING_LICENSE
    case ONBOARDING_STEP.DRIVING_LICENSE:
      return ONBOARDING_STEP.INSURANCE
    case ONBOARDING_STEP.INSURANCE:
      return null // End of flow
    default:
      return null
  }
}

/**
 * Gets the previous step in the onboarding flow
 *
 * @param currentStep - The current onboarding step
 * @returns The previous step, or null if at the beginning
 */
export function getPreviousOnboardingStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  switch (currentStep) {
    case ONBOARDING_STEP.MOBILE:
      return null // Beginning of flow
    case ONBOARDING_STEP.OTP:
      return ONBOARDING_STEP.MOBILE
    case ONBOARDING_STEP.PROFILE:
      return ONBOARDING_STEP.OTP
    case ONBOARDING_STEP.STRIPE:
      return ONBOARDING_STEP.PROFILE
    case ONBOARDING_STEP.DRIVING_LICENSE:
      return ONBOARDING_STEP.STRIPE
    case ONBOARDING_STEP.INSURANCE:
      return ONBOARDING_STEP.DRIVING_LICENSE
    default:
      return null
  }
}

// ============================================================================
// UI UTILITIES
// ============================================================================

/**
 * Gets the step title for display purposes
 *
 * @param step - The onboarding step
 * @returns The display title for the step
 */
export function getOnboardingStepTitle(step: OnboardingStep): string {
  switch (step) {
    case ONBOARDING_STEP.MOBILE:
      return STEP_TITLES.MOBILE
    case ONBOARDING_STEP.OTP:
      return STEP_TITLES.OTP
    case ONBOARDING_STEP.PROFILE:
      return STEP_TITLES.PROFILE
    case ONBOARDING_STEP.LOADING:
      return STEP_TITLES.LOADING
    case ONBOARDING_STEP.STRIPE:
      return STEP_TITLES.STRIPE
    case ONBOARDING_STEP.DRIVING_LICENSE:
      return STEP_TITLES.DRIVING_LICENSE
    case ONBOARDING_STEP.INSURANCE:
      return STEP_TITLES.INSURANCE
    default:
      return STEP_TITLES.LOADING // Fallback to loading title
  }
}

/**
 * Checks if a step should show a back button
 *
 * @param step - The onboarding step
 * @returns Whether the step should show a back button
 */
export function shouldShowBackButton(step: OnboardingStep): boolean {
  return (
    step === ONBOARDING_STEP.OTP ||
    step === ONBOARDING_STEP.PROFILE ||
    step === ONBOARDING_STEP.STRIPE ||
    step === ONBOARDING_STEP.DRIVING_LICENSE ||
    step === ONBOARDING_STEP.INSURANCE
  )
}

/**
 * Checks if a step should show a close button
 *
 * @param step - The onboarding step
 * @returns Whether the step should show a close button
 */
export function shouldShowCloseButton(step: OnboardingStep): boolean {
  return step === ONBOARDING_STEP.MOBILE
}

// ============================================================================
// FORM UTILITIES
// ============================================================================

/**
 * Processes profile form data into the required format
 *
 * @param formState - The profile form state
 * @returns Processed profile data
 */
export function processProfileFormData(formState: {
  firstName: string
  lastName: string
  email: string
}) {
  const { firstName, lastName, email } = formState
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

  return {
    name: fullName,
    email: email.trim(),
  }
}

/**
 * Validates if profile form data is complete
 *
 * @param formState - The profile form state
 * @returns Whether the form is valid
 */
export function isProfileFormValid(formState: {
  firstName: string
  lastName: string
  email: string
}): boolean {
  const { firstName, lastName, email } = formState
  return !!(
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    email.includes('@')
  )
}

/**
 * Validates if phone number is valid
 *
 * @param phoneNumber - The phone number to validate
 * @returns Whether the phone number is valid
 */
export function isPhoneNumberValid(phoneNumber: string): boolean {
  if (!phoneNumber.trim()) {
    return false
  }

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '')

  // Check if it has at least 10 digits (minimum for most countries)
  // and at most 15 digits (international standard)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15
}
