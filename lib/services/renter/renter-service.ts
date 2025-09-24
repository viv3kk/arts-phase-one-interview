/**
 * Renter service for managing renter profiles and documents
 * Uses shared API client with auth interceptors
 */

import { API_ENDPOINTS } from '../../config/api-endpoints'
import {
  RenterProfile,
  RenterProfileUpdateRequest,
} from '../../types/api/common'
import { createSharedApiClient, ApiClient } from '../base/api-client'

/**
 * Renter service for handling profile operations
 * Uses shared API client with auth interceptors
 */
export class RenterService {
  private apiClient: ApiClient

  constructor() {
    // Renter service needs credentials for most operations
    this.apiClient = createSharedApiClient({
      credentials: 'include',
    })
  }

  /**
   * Get renter profile information
   *
   * @returns Promise with the renter profile
   */
  async getProfile(): Promise<RenterProfile> {
    try {
      console.log('Fetching renter profile...')

      const response = await this.apiClient.get<RenterProfile>(
        API_ENDPOINTS.RENTER.GET_PROFILE,
      )

      console.log('Renter profile response:', response)
      return response
    } catch (error) {
      console.error('Error fetching renter profile:', error)
      throw error
    }
  }

  /**
   * Update renter profile information
   *
   * @param profileData - The profile data to update
   * @returns Promise with the updated renter profile
   */
  async updateProfile(
    profileData: RenterProfileUpdateRequest,
  ): Promise<RenterProfile> {
    try {
      console.log('Updating renter profile:', profileData)

      const response = await this.apiClient.patch<RenterProfile>(
        API_ENDPOINTS.RENTER.UPDATE_PROFILE,
        profileData,
      )

      console.log('Profile update response:', response)
      return response
    } catch (error) {
      console.error('Error updating renter profile:', error)
      throw error
    }
  }

  /**
   * Update renter profile with insurance proof
   *
   * @param insuranceProof - The insurance proof data
   * @returns Promise with the updated renter profile
   */
  async updateInsuranceProof(
    insuranceProof: RenterProfileUpdateRequest['insuranceProof'],
  ): Promise<RenterProfile> {
    try {
      console.log('Updating insurance proof:', insuranceProof)

      const response = await this.apiClient.patch<RenterProfile>(
        API_ENDPOINTS.RENTER.UPDATE_PROFILE,
        { insuranceProof },
      )

      console.log('Insurance proof update response:', response)
      return response
    } catch (error) {
      console.error('Error updating insurance proof:', error)
      throw error
    }
  }

  /**
   * Update renter profile with driver license
   *
   * @param driverLicense - The driver license data
   * @returns Promise with the updated renter profile
   */
  async updateDriverLicense(
    driverLicense: RenterProfileUpdateRequest['driverLicense'],
  ): Promise<RenterProfile> {
    try {
      console.log('Updating driver license:', driverLicense)

      const response = await this.apiClient.patch<RenterProfile>(
        API_ENDPOINTS.RENTER.UPDATE_PROFILE,
        { driverLicense },
      )

      console.log('Driver license update response:', response)
      return response
    } catch (error) {
      console.error('Error updating driver license:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const renterService = new RenterService()
