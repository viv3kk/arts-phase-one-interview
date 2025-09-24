/**
 * Onboarding types and interfaces
 * Centralized types for the onboarding flow
 */

import type { Renter } from '@/lib/stores/slices/renter.slice'

// ============================================================================
// ONBOARDING STEP TYPES
// ============================================================================

/**
 * Onboarding step types
 */
export type OnboardingStep =
  | 'mobile'
  | 'otp'
  | 'profile'
  | 'loading'
  | 'stripe'
  | 'driving-license'
  | 'insurance'

/**
 * Onboarding step constants for consistent usage
 */
export const ONBOARDING_STEP = {
  MOBILE: 'mobile' as const,
  OTP: 'otp' as const,
  PROFILE: 'profile' as const,
  LOADING: 'loading' as const,
  STRIPE: 'stripe' as const,
  DRIVING_LICENSE: 'driving-license' as const,
  INSURANCE: 'insurance' as const,
} as const

// ============================================================================
// IDENTITY VERIFICATION TYPES
// ============================================================================

/**
 * Identity verification status types
 */
export type IdentityVerificationStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'FAILED'

/**
 * Identity verification status constants
 */
export const IDENTITY_VERIFICATION_STATUS = {
  NOT_STARTED: 'NOT_STARTED' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  VERIFIED: 'VERIFIED' as const,
  FAILED: 'FAILED' as const,
} as const

// ============================================================================
// FORM STATE TYPES
// ============================================================================

/**
 * Login form state interface
 */
export interface LoginFormState {
  phoneNumber: string
  selectedCountry: string
  otp: string
  phoneSubmitted: boolean
  otpRequestId: string | null
}

/**
 * Profile form state interface
 */
export interface ProfileFormState {
  firstName: string
  lastName: string
  email: string
}

/**
 * Insurance data interface for onboarding
 */
export interface InsuranceData {
  insuranceProvider: string
  policyNumber: string
  additionalNotes: string
  insuranceCard: File | null
  declarationPage: File | null
}

// ============================================================================
// STEP COMPONENT PROPS
// ============================================================================

/**
 * Base step component props
 */
export interface BaseStepProps {
  onComplete: () => void
}

/**
 * Step component props interfaces
 */
export interface InsuranceDetailsStepProps {
  onComplete: (data: InsuranceData) => Promise<void>
}

export interface DrivingLicenseStepProps {
  onComplete: () => Promise<void>
}

export interface ProfileStepProps {
  onComplete: () => void
}

export interface StripeIdentificationStepProps {
  onComplete: () => void
}

// ============================================================================
// UTILITY FUNCTION TYPES
// ============================================================================

/**
 * Function to get onboarding step based on auth status and profile
 */
export type GetOnboardingStepFunction = (
  isAuthenticated: boolean,
  renterProfile: Renter | null,
) => OnboardingStep | null

/**
 * Function to check if profile is complete
 */
export type IsProfileCompleteFunction = (
  renterProfile: Renter | null,
) => boolean

/**
 * Function to get next step in flow
 */
export type GetNextStepFunction = (
  currentStep: OnboardingStep,
) => OnboardingStep | null

/**
 * Function to get previous step in flow
 */
export type GetPreviousStepFunction = (
  currentStep: OnboardingStep,
) => OnboardingStep | null

/**
 * Function to get step title
 */
export type GetStepTitleFunction = (step: OnboardingStep) => string

/**
 * Function to check if step should show back button
 */
export type ShouldShowBackButtonFunction = (step: OnboardingStep) => boolean

/**
 * Function to check if step should show close button
 */
export type ShouldShowCloseButtonFunction = (step: OnboardingStep) => boolean
