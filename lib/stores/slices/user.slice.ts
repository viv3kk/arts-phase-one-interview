/**
 * User slice for Zustand store
 * Manages user profile and related data
 */
'use client'

import { StateCreator } from 'zustand'
import {
  BaseSlice,
  ActionCreator,
  ComputedGetter,
} from '@/lib/types/store.types'

/**
 * User profile interface
 * Minimal user data - full profile fetched from API as needed
 */
export interface User {
  id: string
  name: string
  email?: string
  mobileNumber: string
  profileComplete: boolean
  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, unknown>
}

/**
 * User profile update payload
 */
export interface UserProfileUpdate {
  name?: string
  email?: string
  mobileNumber?: string
  profileComplete?: boolean
  metadata?: Record<string, unknown>
}

/**
 * User state interface extending base slice
 */
export interface UserState extends BaseSlice {
  // User profile state
  profile: User | null

  // User-specific actions
  setProfile: ActionCreator<[User]>
  updateProfile: ActionCreator<[UserProfileUpdate]>
  clearProfile: ActionCreator<[]>

  // Computed getters
  needsProfileCompletion: ComputedGetter<boolean>
  hasValidProfile: ComputedGetter<boolean>
  getUserDisplayName: ComputedGetter<string>
}

/**
 * Initial user state
 */
export const initialUserState: Omit<
  UserState,
  | 'setProfile'
  | 'updateProfile'
  | 'clearProfile'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'needsProfileCompletion'
  | 'hasValidProfile'
  | 'getUserDisplayName'
> = {
  profile: null,
  isLoading: false,
  error: null,
}

/**
 * User state slice factory
 * Creates user slice with all actions and state management
 */
export const createUserSlice: StateCreator<UserState> = (set, get) => ({
  ...initialUserState,

  // Set complete user profile
  setProfile: (profile: User) =>
    set({
      profile,
      isLoading: false,
      error: null,
    }),

  // Update partial user profile data
  updateProfile: (profileData: UserProfileUpdate) =>
    set(state => ({
      profile: state.profile ? { ...state.profile, ...profileData } : null,
      error: null,
    })),

  // Clear user profile
  clearProfile: () =>
    set({
      profile: null,
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

  // Computed: Check if profile needs completion
  needsProfileCompletion: () => {
    const state = get()
    return !!(state.profile && !state.profile.profileComplete)
  },

  // Computed: Check if user has valid profile
  hasValidProfile: () => {
    const state = get()
    return !!(state.profile && state.profile.profileComplete)
  },

  // Computed: Get user display name with fallback
  getUserDisplayName: () => {
    const state = get()
    if (!state.profile) return 'Guest'
    return state.profile.name || state.profile.mobileNumber || 'User'
  },
})
