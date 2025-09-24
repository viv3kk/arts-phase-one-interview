/**
 * Onboarding constants
 * Centralized constants for the onboarding flow
 */

// ============================================================================
// FORM INITIAL STATES
// ============================================================================

export const INITIAL_LOGIN_FORM_STATE = {
  phoneNumber: '',
  selectedCountry: 'United States (+1)',
  otp: '',
  phoneSubmitted: false,
  otpRequestId: null,
} as const

export const INITIAL_PROFILE_FORM_STATE = {
  firstName: '',
  lastName: '',
  email: '',
} as const

// ============================================================================
// LOADING TIMINGS
// ============================================================================

export const LOADING_TIMINGS = {
  TEXT_CYCLE_INTERVAL: 2000,
  FADE_TRANSITION_DELAY: 300,
} as const

// ============================================================================
// LOADING MESSAGES
// ============================================================================

export const LOADING_MESSAGES = {
  CHECKING_STRIPE_IDENTITY: 'Verifying your identity status',
  CHECKING_DRIVING_LICENSE: 'Checking your driving license',
  CHECKING_INSURANCE: 'Validating your insurance details',
  SETTING_UP_ACCOUNT: 'Please wait while we verify your account information.',
  UPDATING_PROFILE: 'Updating your profile...',
  PROCESSING_VERIFICATION: 'Processing your verification...',
} as const

// ============================================================================
// STRIPE IDENTITY MESSAGES
// ============================================================================

export const STRIPE_IDENTITY_MESSAGES = {
  TITLE: 'Identity Verification',
  DESCRIPTION:
    'To complete your account setup, we need to verify your identity.',
  YOU_WILL_BE_ASKED: "You'll be asked to:",
  UPLOAD_ID: 'Upload a photo of your government-issued ID',
  TAKE_SELFIE: 'Take a selfie for verification',
  SECURITY_NOTICE:
    'This process is secure and your information is protected by Stripe.',
  START_VERIFICATION: 'Start Verification',
  VERIFICATION_COMPLETED: 'Identity verification completed!',
  VERIFICATION_FAILED: 'Verification failed. Please try again.',
  VERIFY_IDENTITY_TO_CONTINUE: 'Verify your identity to continue',
  UPDATING_PROFILE: 'Updating your profile...',
  PROCESSING_VERIFICATION: 'Processing your verification...',
} as const

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  FAILED_TO_CREATE_VERIFICATION: 'Failed to create verification session',
  FAILED_TO_INITIALIZE_STRIPE: 'Failed to initialize Stripe',
  IDENTITY_VERIFICATION_FAILED: 'Identity verification failed',
  FAILED_TO_REFETCH_PROFILE: 'Failed to refetch profile after verification:',
} as const

// ============================================================================
// STEP TITLES
// ============================================================================

export const STEP_TITLES = {
  MOBILE: 'Login or Sign Up',
  OTP: 'Confirm your number',
  PROFILE: 'Complete Your Profile',
  LOADING: 'Setting up your account',
  STRIPE: 'Identity Verification',
  DRIVING_LICENSE: 'Driving License Verification',
  INSURANCE: 'Insurance Verification',
} as const

// ============================================================================
// COUNTRIES LIST
// ============================================================================

export const COUNTRIES = [
  'United States (+1)',
  'United Kingdom (+44)',
  'Canada (+1)',
  'Australia (+61)',
  'Germany (+49)',
  'France (+33)',
  'Spain (+34)',
  'Italy (+39)',
  'India (+91)',
] as const
