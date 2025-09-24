/**
 * File upload service using shared API client
 * Handles generic file uploads with progress tracking
 */

import { API_ENDPOINTS } from '../../config/api-endpoints'
import { FileUploadResponse, FileType } from '../../types/api/common'
import { createSharedApiClient } from '../base/api-client'

/**
 * File upload service for handling document uploads
 * Uses shared API client with auth interceptors
 */
export const uploadService = {
  /**
   * Upload a single file with type specification
   *
   * @param file - The file to upload
   * @param fileType - The type of file (e.g., FILE_TYPE.INSURANCE_CARD)
   * @returns Promise with the upload response
   */
  async uploadFile(
    file: File,
    fileType: FileType,
  ): Promise<FileUploadResponse> {
    try {
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        fileType,
      })

      // Create FormData matching the exact order used in the working curl command
      const formData = new FormData()
      formData.append('fileType', fileType)
      formData.append('file', file)

      // Log FormData entries for debugging
      console.log('FormData entries:')
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(
            `${pair[0]}: File(${(pair[1] as File).name}, ${(pair[1] as File).type}, ${(pair[1] as File).size} bytes)`,
          )
        } else {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
      }

      const apiClient = createSharedApiClient({
        credentials: 'include',
      })

      const response = await apiClient.post<FileUploadResponse>(
        API_ENDPOINTS.UPLOAD.GENERIC_FILE,
        formData,
      )

      console.log('Upload response:', response)
      return response
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  /**
   * Upload multiple files with the same type
   *
   * @param files - The files to upload
   * @param fileType - The type of files (e.g., FILE_TYPE.INSURANCE_DOCUMENT)
   * @returns Promise with array of upload responses
   */
  async uploadMultipleFiles(
    files: File[],
    fileType: FileType,
  ): Promise<FileUploadResponse[]> {
    try {
      // Upload each file sequentially
      const uploadPromises = files.map(file => this.uploadFile(file, fileType))
      return Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading multiple files:', error)
      throw error
    }
  },
}
