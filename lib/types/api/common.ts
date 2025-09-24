/**
 * Common API types and enums
 * These types will be generated from OpenAPI specification
 */

// Common enums
export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum DocumentType {
  DRIVERS_LICENSE = 'drivers_license',
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  INSURANCE_CARD = 'insurance_card',
  CREDIT_CARD = 'credit_card',
}

// Common interfaces
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Document extends BaseEntity {
  type: DocumentType
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  verificationStatus: VerificationStatus
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

// Generic file interface for images, documents, etc.
export interface File {
  id: string
  name: string
  relativePath: string
}

// API response wrappers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  timestamp: string
  requestId: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: Record<string, any>
    field?: string
  }
  timestamp: string
  requestId: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// File upload types
export interface FileUploadRequest {
  file: File
  fileType: FileType
}

export interface FileUploadResponse {
  id: string
  filename: string
  originalFileName: string
  mimeType: string
  size: number
  url: string
  relativePath: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

// export type FileType =
//   | 'INSURANCE_CARD'
//   | 'INSURANCE_CARD_BACK'
//   | 'INSURANCE_DOCUMENT'
//   | 'DRIVING_LICENSE_PROOF'

// // File type constants for consistent usage across the application
// export const FILE_TYPE = {
//   INSURANCE_CARD: 'INSURANCE_CARD' as const,
//   INSURANCE_CARD_BACK: 'INSURANCE_CARD_BACK' as const,
//   INSURANCE_DOCUMENT: 'INSURANCE_DOCUMENT' as const,
//   DRIVING_LICENSE_PROOF: 'DRIVING_LICENSE_PROOF' as const,
// } as const

// ============================================================================
// RENTER TYPES
// ============================================================================

/**
 * Insurance file information
 */
export interface InsuranceFile {
  id: string
  relativePath: string
  name: string
}

/**
 * Insurance proof information
 */
export interface InsuranceProof {
  insuranceProvider: string
  policyNumber: string
  insuranceFile: InsuranceFile
  insuranceCard: InsuranceFile
  notes?: string
}

/**
 * Driver license information
 */
export interface DriverLicense {
  id: string
  relativePath: string
  name: string
}

/**
 * Renter profile information
 */
export interface RenterProfile {
  renterId: string
  name: string | null
  email: string | null
  mobileNumber: string
  age: number | null
  driverLicense: DriverLicense | null
  insuranceDocument: InsuranceProof | null
  businessProfileId: string
  identityVerificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED'
  identityVerifiedAt: number | null
  identityVerificationFailedReason: string | null
}

/**
 * Renter profile update request
 */
export interface RenterProfileUpdateRequest {
  name?: string
  email?: string
  insuranceProof?: InsuranceProof
  driverLicense?: DriverLicense
}

/**
 * Renter profile response
 */
export interface RenterProfileResponse {
  success: boolean
  data?: RenterProfile
  error?: string
}

// File upload types
export type FileType =
  | 'INSURANCE_CARD'
  | 'INSURANCE_CARD_BACK'
  | 'INSURANCE_DOCUMENT'
  | 'DRIVING_LICENSE_PROOF'
  | 'CHAT_ATTACHMENTS'
  | 'VEHICLE_IMAGE'
  | 'RENTAL_CHECK_IN_OUT_IMAGES'

// File type constants for consistent usage across the application
export const FILE_TYPE = {
  INSURANCE_CARD: 'INSURANCE_CARD' as const,
  INSURANCE_CARD_BACK: 'INSURANCE_CARD_BACK' as const,
  INSURANCE_DOCUMENT: 'INSURANCE_DOCUMENT' as const,
  DRIVING_LICENSE_PROOF: 'DRIVING_LICENSE_PROOF' as const,
  CHAT_ATTACHMENTS: 'CHAT_ATTACHMENTS' as const,
  VEHICLE_IMAGE: 'VEHICLE_IMAGE' as const,
  RENTAL_CHECK_IN_OUT_IMAGES: 'RENTAL_CHECK_IN_OUT_IMAGES' as const,
} as const

// ============================================================================
// RENTER TYPES
// ============================================================================

/**
 * Insurance file information
 */
export interface InsuranceFile {
  id: string
  relativePath: string
  name: string
}

/**
 * Insurance proof information
 */
export interface InsuranceProof {
  insuranceProvider: string
  policyNumber: string
  insuranceFile: InsuranceFile
  insuranceCard: InsuranceFile
  notes?: string
}

/**
 * Driver license information
 */
export interface DriverLicense {
  id: string
  relativePath: string
  name: string
}

/**
 * Renter profile information
 */
export interface RenterProfile {
  renterId: string
  name: string | null
  email: string | null
  mobileNumber: string
  age: number | null
  driverLicense: DriverLicense | null
  insuranceDocument: InsuranceProof | null
  businessProfileId: string
  identityVerificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED'
  identityVerifiedAt: number | null
  identityVerificationFailedReason: string | null
}

/**
 * Renter profile update request
 */
export interface RenterProfileUpdateRequest {
  name?: string
  email?: string
  insuranceProof?: InsuranceProof
  driverLicense?: DriverLicense
}

/**
 * Renter profile response
 */
export interface RenterProfileResponse {
  success: boolean
  data?: RenterProfile
  error?: string
}
