/**
 * Renter slice for Zustand store
 * Manages renter profile and document information
 * Follows the same pattern as user.slice.ts for consistency
 */
'use client'

import { StateCreator } from 'zustand'
import {
  BaseSlice,
  ActionCreator,
  ComputedGetter,
} from '@/lib/types/store.types'
import type { InsuranceProof, DriverLicense } from '../../types/api/common'

/**
 * Renter profile interface
 * Extends API types with additional metadata for store management
 */
export interface Renter {
  id: string
  name: string | null
  email: string | null
  mobileNumber: string
  age: number | null
  driverLicense: DriverLicense | null
  insuranceDocument: InsuranceProof | null
  businessProfileId: string
  identityVerificationStatus:
    | 'PENDING'
    | 'VERIFIED'
    | 'FAILED'
    | 'IN_PROGRESS'
    | 'NOT_STARTED'
  identityVerifiedAt?: number | null
  identityVerificationFailedReason?: string | null
  profileComplete: boolean
  metadata?: Record<string, unknown>
}

/**
 * Renter profile update payload
 * Allows partial updates to renter information
 */
export interface RenterProfileUpdate {
  name?: string
  email?: string
  insuranceDocument?: InsuranceProof
  driverLicense?: DriverLicense
  identityVerificationStatus:
    | 'PENDING'
    | 'VERIFIED'
    | 'FAILED'
    | 'IN_PROGRESS'
    | 'NOT_STARTED'
  metadata?: Record<string, unknown>
}

/**
 * Renter state interface extending base slice
 * Follows the same pattern as UserState for consistency
 */
export interface RenterState extends BaseSlice {
  // Renter profile state - renamed to avoid conflicts with UserState.profile
  renterProfile: Renter | null

  // Renter-specific actions
  setRenterProfile: ActionCreator<[Renter]>
  updateRenterProfile: ActionCreator<[RenterProfileUpdate]>
  clearRenterProfile: ActionCreator<[]>

  // Computed getters
  hasInsuranceProof: ComputedGetter<boolean>
  hasDriverLicense: ComputedGetter<boolean>
  isRenterProfileComplete: ComputedGetter<boolean>
  getRenterDisplayName: ComputedGetter<string>
}

/**
 * Initial renter state
 * Follows the same pattern as initialUserState
 */
export const initialRenterState: Omit<
  RenterState,
  | 'setRenterProfile'
  | 'updateRenterProfile'
  | 'clearRenterProfile'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'hasInsuranceProof'
  | 'hasDriverLicense'
  | 'isRenterProfileComplete'
  | 'getRenterDisplayName'
> = {
  renterProfile: null,
  isLoading: false,
  error: null,
}

/**
 * Renter state slice factory
 * Creates renter slice with all actions and state management
 * Follows the exact same pattern as createUserSlice
 */
export const createRenterSlice: StateCreator<RenterState> = (set, get) => ({
  ...initialRenterState,

  // Set complete renter profile
  setRenterProfile: (profile: Renter) =>
    set({
      renterProfile: profile,
      isLoading: false,
      error: null,
    }),

  // Update partial renter profile data
  updateRenterProfile: (profileData: RenterProfileUpdate) =>
    set(state => ({
      renterProfile: state.renterProfile
        ? { ...state.renterProfile, ...profileData }
        : null,
      error: null,
    })),

  // Clear renter profile
  clearRenterProfile: () =>
    set({
      renterProfile: null,
      error: null,
    }),

  // Set loading state (from BaseSlice)
  setLoading: (isLoading: boolean) =>
    set({
      isLoading,
    }),

  // Set error message (from BaseSlice)
  setError: (error: string | null) =>
    set({
      error,
      isLoading: false,
    }),

  // Clear error (from BaseSlice)
  clearError: () =>
    set({
      error: null,
    }),

  // Computed: Check if renter has insurance proof
  hasInsuranceProof: () => {
    const state = get()
    return !!state.renterProfile?.insuranceDocument
  },

  // Computed: Check if renter has driver license
  hasDriverLicense: () => {
    const state = get()
    return !!state.renterProfile?.driverLicense
  },

  // Computed: Check if renter profile is complete
  isRenterProfileComplete: () => {
    const state = get()
    return !!(state.renterProfile && state.renterProfile.profileComplete)
  },

  // Computed: Get renter display name with fallback
  getRenterDisplayName: () => {
    const state = get()
    if (!state.renterProfile) return 'Guest'
    return state.renterProfile.name || state.renterProfile.email || 'Renter'
  },
})
