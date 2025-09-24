/**
 * Upload service hooks following the three-layer hook architecture
 * 1. Data Layer - React Query hooks for API operations
 * 2. Business Logic Layer - Custom hooks that orchestrate operations
 * 3. UI Layer - Components that consume business logic hooks
 */
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FileType, FileUploadResponse } from '../../types/api/common'
import { FILE_TYPE } from '../../types/api/common'
import { uploadService } from '../upload/upload-service'

// Query keys for React Query
export const uploadKeys = {
  all: ['upload'] as const,
  file: (fileId: string) => [...uploadKeys.all, 'file', fileId] as const,
}

/**
 * Single file upload mutation hook
 * Provides basic mutation functionality with React Query
 */
export function useUploadFile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ file, fileType }: { file: File; fileType: FileType }) => {
      return uploadService.uploadFile(file, fileType)
    },
    onSuccess: (response: FileUploadResponse) => {
      // Invalidate and refetch upload-related queries
      queryClient.invalidateQueries({ queryKey: uploadKeys.all })

      // Set the uploaded file in cache
      queryClient.setQueryData(uploadKeys.file(response.id), response)
    },
    onError: (error: Error) => {
      console.error('File upload failed:', error)
    },
  })

  return {
    // Fire-and-forget (for simple operations)
    uploadFile: mutation.mutate,
    // Awaitable (for complex flows)
    uploadFileAsync: mutation.mutateAsync,
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    // Utilities
    reset: mutation.reset,
    data: mutation.data,
  }
}

/**
 * Multiple files upload mutation hook
 * Provides basic mutation functionality with React Query
 */
export function useUploadMultipleFiles() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      files,
      fileType,
    }: {
      files: File[]
      fileType: FileType
    }) => {
      return uploadService.uploadMultipleFiles(files, fileType)
    },
    onSuccess: (responses: FileUploadResponse[]) => {
      // Invalidate and refetch upload-related queries
      queryClient.invalidateQueries({ queryKey: uploadKeys.all })

      // Set all uploaded files in cache
      responses.forEach(response => {
        queryClient.setQueryData(uploadKeys.file(response.id), response)
      })
    },
    onError: (error: Error) => {
      console.error('Multiple files upload failed:', error)
    },
  })

  return {
    // Fire-and-forget (for simple operations)
    uploadMultipleFiles: mutation.mutate,
    // Awaitable (for complex flows)
    uploadMultipleFilesAsync: mutation.mutateAsync,
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
 * Generic file upload orchestration hook
 * Encapsulates business logic for all file upload operations
 */
export function useFileUpload() {
  const uploadFileMutation = useUploadFile()
  const uploadMultipleFilesMutation = useUploadMultipleFiles()

  /**
   * Upload a single file with specified file type
   */
  const uploadSingleFile = async (file: File, fileType: FileType) => {
    try {
      const result = await uploadFileMutation.uploadFileAsync({
        file,
        fileType,
      })
      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      }
    }
  }

  /**
   * Upload multiple files with specified file type
   */
  const uploadMultipleFiles = async (files: File[], fileType: FileType) => {
    try {
      const results =
        await uploadMultipleFilesMutation.uploadMultipleFilesAsync({
          files,
          fileType,
        })
      return { success: true, data: results }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to upload files',
      }
    }
  }

  // Specialized upload functions for specific use cases
  const uploadInsuranceCard = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.INSURANCE_CARD)

  const uploadInsuranceDocument = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.INSURANCE_DOCUMENT)

  const uploadDriversLicense = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.DRIVING_LICENSE_PROOF)

  const uploadChatAttachment = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.CHAT_ATTACHMENTS)

  const uploadChatAttachments = async (files: File[]) =>
    uploadMultipleFiles(files, FILE_TYPE.CHAT_ATTACHMENTS)

  const uploadVehicleImage = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.VEHICLE_IMAGE)

  const uploadRentalCheckInOutImage = async (file: File) =>
    uploadSingleFile(file, FILE_TYPE.RENTAL_CHECK_IN_OUT_IMAGES)

  return {
    // Generic upload functions
    uploadSingleFile,
    uploadMultipleFiles,

    // Specialized upload functions
    uploadInsuranceCard,
    uploadInsuranceDocument,
    uploadDriversLicense,
    uploadChatAttachment,
    uploadChatAttachments,
    uploadVehicleImage,
    uploadRentalCheckInOutImage,

    // State
    isLoading:
      uploadFileMutation.isLoading || uploadMultipleFilesMutation.isLoading,
    error: uploadFileMutation.error || uploadMultipleFilesMutation.error,

    // Individual states for granular control
    isSingleUploading: uploadFileMutation.isLoading,
    isMultipleUploading: uploadMultipleFilesMutation.isLoading,
    singleUploadError: uploadFileMutation.error,
    multipleUploadError: uploadMultipleFilesMutation.error,
  }
}

/**
 * @deprecated Use useFileUpload() instead
 * Legacy hook for backward compatibility
 */
export function useDocumentUpload() {
  const fileUpload = useFileUpload()

  return {
    uploadInsuranceCard: fileUpload.uploadInsuranceCard,
    uploadInsuranceDocument: fileUpload.uploadInsuranceDocument,
    uploadDriversLicense: fileUpload.uploadDriversLicense,
    isLoading: fileUpload.isLoading,
    error: fileUpload.error,
  }
}

/**
 * @deprecated Use useFileUpload() instead
 * Legacy hook for backward compatibility
 */
export function useChatAttachmentUpload() {
  const fileUpload = useFileUpload()

  return {
    uploadSingleAttachment: fileUpload.uploadChatAttachment,
    uploadMultipleAttachments: fileUpload.uploadChatAttachments,
    isLoading: fileUpload.isLoading,
    error: fileUpload.error,
    isSingleUploading: fileUpload.isSingleUploading,
    isMultipleUploading: fileUpload.isMultipleUploading,
    singleUploadError: fileUpload.singleUploadError,
    multipleUploadError: fileUpload.multipleUploadError,
  }
}
