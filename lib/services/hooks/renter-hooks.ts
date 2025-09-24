/**
 * Renter service hooks following the three-layer hook architecture
 * 1. Data Layer - React Query hooks for API operations
 * 2. Business Logic Layer - Custom hooks that orchestrate operations
 * 3. UI Layer - Components that consume business logic hooks
 */
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { renterService } from '../renter/renter-service'
import type {
  RenterProfile,
  RenterProfileUpdateRequest,
  InsuranceProof,
  DriverLicense,
} from '../../types/api/common'
import { useAuth, useRenter } from '@/lib/providers/StoreProvider'
import { ApiError } from 'next/dist/server/api-utils'
import { useEffect } from 'react'

// Query keys for React Query
export const renterKeys = {
  all: ['renter'] as const,
  profile: () => [...renterKeys.all, 'profile'] as const,
  documents: () => [...renterKeys.all, 'documents'] as const,
}

// ============================================================================
// 1. DATA LAYER - React Query Hooks
// ============================================================================

/**
 * Get renter profile query hook
 * Provides basic query functionality with React Query
 */
export function useRenterProfile() {
  const { setIsAuthenticated } = useAuth()
  const { setRenterProfile } = useRenter()
  const query = useQuery({
    queryKey: renterKeys.profile(),
    queryFn: async () => {
      try {
        return await renterService.getProfile()
      } catch (error) {
        const _message =
          error instanceof ApiError
            ? error.message
            : 'Failed to fetch user profile.'
        throw error
      }
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh
    gcTime: 15 * 60 * 1000, // 15 minutes cache time
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: 1,
  })

  useEffect(() => {
    if (query.data) {
      console.log(
        'Setting Renter Profile from Renter Profile Hook:',
        query.data,
      )
      setIsAuthenticated(true)

      const renterProfile = query.data
      setRenterProfile({
        id: renterProfile.renterId,
        name: renterProfile.name,
        email: renterProfile.email,
        mobileNumber: renterProfile.mobileNumber,
        age: renterProfile.age,
        driverLicense: renterProfile.driverLicense,
        insuranceDocument: renterProfile.insuranceDocument,
        businessProfileId: renterProfile.businessProfileId,
        identityVerificationStatus: renterProfile.identityVerificationStatus,
        identityVerifiedAt: renterProfile.identityVerifiedAt,
        identityVerificationFailedReason:
          renterProfile.identityVerificationFailedReason,
        profileComplete: !!(
          renterProfile.driverLicense && renterProfile.insuranceDocument
        ),
      })
    }
  }, [query.data, setIsAuthenticated, setRenterProfile])

  return query
}

/**
 * Hook to invalidate and refetch renter profile
 * Provides a clean way to refresh profile data
 */
export function useInvalidateRenterProfile() {
  const queryClient = useQueryClient()

  const refetchProfile = async () => {
    return await queryClient.refetchQueries({ queryKey: renterKeys.profile() })
  }

  return {
    refetchProfile,
  }
}

/**
 * Update renter profile mutation hook
 * Provides basic mutation functionality with React Query
 */
export function useUpdateRenterProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (profileData: RenterProfileUpdateRequest) => {
      return renterService.updateProfile(profileData)
    },
    onSuccess: (response: RenterProfile) => {
      // Invalidate and refetch renter-related queries
      queryClient.invalidateQueries({ queryKey: renterKeys.all })

      // Set the updated profile in cache
      queryClient.setQueryData(renterKeys.profile(), response)
    },
    onError: (error: Error) => {
      console.error('Profile update failed:', error)
    },
  })

  return {
    // Fire-and-forget (for simple operations)
    updateProfile: mutation.mutate,
    // Awaitable (for complex flows)
    updateProfileAsync: mutation.mutateAsync,
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    // Utilities
    reset: mutation.reset,
    data: mutation.data,
  }
}

/**
 * Update insurance proof mutation hook
 * Provides basic mutation functionality with React Query
 */
export function useUpdateInsuranceProof() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (insuranceProof: InsuranceProof) => {
      return renterService.updateInsuranceProof(insuranceProof)
    },
    onSuccess: (response: RenterProfile) => {
      // Invalidate and refetch renter-related queries
      queryClient.invalidateQueries({ queryKey: renterKeys.all })

      // Set the updated profile in cache
      queryClient.setQueryData(renterKeys.profile(), response)
    },
    onError: (error: Error) => {
      console.error('Insurance proof update failed:', error)
    },
  })

  return {
    // Fire-and-forget (for simple operations)
    updateInsuranceProof: mutation.mutate,
    // Awaitable (for complex flows)
    updateInsuranceProofAsync: mutation.mutateAsync,
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    // Utilities
    reset: mutation.reset,
    data: mutation.data,
  }
}

/**
 * Update driver license mutation hook
 * Provides basic mutation functionality with React Query
 */
export function useUpdateDriverLicense() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (driverLicense: DriverLicense) => {
      return renterService.updateDriverLicense(driverLicense)
    },
    onSuccess: (response: RenterProfile) => {
      // Invalidate and refetch renter-related queries
      queryClient.invalidateQueries({ queryKey: renterKeys.all })

      // Set the updated profile in cache
      queryClient.setQueryData(renterKeys.profile(), response)
    },
    onError: (error: Error) => {
      console.error('Driver license update failed:', error)
    },
  })

  return {
    // Fire-and-forget (for simple operations)
    updateDriverLicense: mutation.mutate,
    // Awaitable (for complex flows)
    updateDriverLicenseAsync: mutation.mutateAsync,
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    // Utilities
    reset: mutation.reset,
    data: mutation.data,
  }
}

// ============================================================================
// 2. BUSINESS LOGIC LAYER - Orchestration Hooks
// ============================================================================

/**
 * Renter profile orchestration hook
 * Encapsulates business logic for profile operations
 */
export function useRenterProfileFlow() {
  const updateProfileMutation = useUpdateRenterProfile()
  const updateInsuranceProofMutation = useUpdateInsuranceProof()
  const updateDriverLicenseMutation = useUpdateDriverLicense()

  const updateProfile = async (profileData: RenterProfileUpdateRequest) => {
    try {
      const result = await updateProfileMutation.updateProfileAsync(profileData)
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const updateInsuranceProof = async (insuranceProof: InsuranceProof) => {
    try {
      const result =
        await updateInsuranceProofMutation.updateInsuranceProofAsync(
          insuranceProof,
        )
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const updateDriverLicense = async (driverLicense: DriverLicense) => {
    try {
      const result =
        await updateDriverLicenseMutation.updateDriverLicenseAsync(
          driverLicense,
        )
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  return {
    // Profile operations
    updateProfile,
    updateInsuranceProof,
    updateDriverLicense,

    // State
    isLoading:
      updateProfileMutation.isLoading ||
      updateInsuranceProofMutation.isLoading ||
      updateDriverLicenseMutation.isLoading,
    error:
      updateProfileMutation.error ||
      updateInsuranceProofMutation.error ||
      updateDriverLicenseMutation.error,
  }
}
