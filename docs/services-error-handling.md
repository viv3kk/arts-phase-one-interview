# Error Handling System Documentation

## Overview

The service layer provides a comprehensive error handling system that standardizes error classification, retry logic, and user-friendly error messages across all services. The system is designed to handle various error scenarios including network issues, validation failures, authentication problems, business logic errors, and file upload issues.

## Architecture

### Core Components

1. **ErrorHandler**: Central error processing and classification
2. **ErrorFactory**: Standardized error creation utilities
3. **Error Types**: Strongly typed error interfaces
4. **Error Codes**: Centralized error code constants
5. **User-Friendly Messages**: Human-readable error descriptions

### Error Classification

The system classifies errors into the following categories:

- **Network Errors**: Connection issues, timeouts, DNS failures
- **Validation Errors**: Input validation and schema validation failures
- **Authentication Errors**: Token expiry, invalid credentials, authorization issues
- **Business Logic Errors**: Domain-specific error conditions
- **Tenant Errors**: Multi-tenant configuration and context issues
- **File Upload Errors**: File size, type, and upload-related issues

## Usage

### Basic Error Handling

```typescript
import { ErrorHandler, createDefaultErrorHandler } from '@/lib/services/base'

const errorHandler = createDefaultErrorHandler(true) // Enable logging

try {
  // API call that might fail
  const response = await apiCall()
} catch (error) {
  const serviceError = errorHandler.handle(error, requestContext)

  // Check if error should be retried
  const retryConfig = errorHandler.shouldRetry(serviceError, attemptCount)

  if (retryConfig.shouldRetry) {
    // Retry after delay
    setTimeout(() => retry(), retryConfig.delay)
  } else {
    // Show user-friendly message
    const userMessage = errorHandler.getUserFriendlyMessage(serviceError)
    showErrorToUser(userMessage)
  }
}
```

### Creating Standardized Errors

```typescript
import {
  createTimeoutError,
  createRequiredFieldError,
  createBookingUnavailableError,
  createFileTooLargeError,
} from '@/lib/services/base'

// Network timeout
const timeoutError = createTimeoutError(requestContext, 30000)

// Validation error
const validationError = createRequiredFieldError('email', requestContext)

// Business logic error
const businessError = createBookingUnavailableError(
  'booking-123',
  requestContext,
)

// File upload error
const fileError = createFileTooLargeError(
  'document.pdf',
  15000000,
  10000000,
  requestContext,
)
```

### Specialized Error Handlers

The system provides specialized error handlers for different service types:

```typescript
import {
  createFileUploadErrorHandler,
  createAuthErrorHandler,
  createPaymentErrorHandler,
  createRealtimeErrorHandler,
} from '@/lib/services/base'

// File upload service with extended retries
const fileUploadHandler = createFileUploadErrorHandler(true)

// Authentication service with no retries
const authHandler = createAuthErrorHandler(true)

// Payment service with conservative retries
const paymentHandler = createPaymentErrorHandler(true)

// Real-time service with fast retries
const realtimeHandler = createRealtimeErrorHandler(true)
```

## Error Types

### ServiceError (Base)

```typescript
interface ServiceError {
  code: string
  message: string
  details?: Record<string, any>
  field?: string
  timestamp: string
  requestId: string
  tenantId?: string
}
```

### NetworkError

```typescript
interface NetworkError extends ServiceError {
  statusCode?: number
  retryable: boolean
  retryAfter?: number
}
```

### ValidationError

```typescript
interface ValidationError extends ServiceError {
  field: string
  constraint: string
  rejectedValue: any
}
```

### AuthenticationError

```typescript
interface AuthenticationError extends ServiceError {
  authRequired: boolean
  redirectUrl?: string
}
```

### BusinessLogicError

```typescript
interface BusinessLogicError extends ServiceError {
  businessCode: string
  context?: Record<string, any>
}
```

### TenantError

```typescript
interface TenantError extends ServiceError {
  tenantId: string
  configIssue?: string
}
```

### FileUploadError

```typescript
interface FileUploadError extends ServiceError {
  fileName?: string
  fileSize?: number
  maxSize?: number
  allowedTypes?: string[]
}
```

## Error Codes

### Network and Connectivity

- `NETWORK_ERROR`: General network connectivity issues
- `TIMEOUT_ERROR`: Request timeout
- `CONNECTION_REFUSED`: Server connection refused
- `DNS_ERROR`: DNS resolution failure

### Validation and Input

- `VALIDATION_ERROR`: General validation failure
- `SCHEMA_VALIDATION_ERROR`: Schema validation failure
- `REQUIRED_FIELD_ERROR`: Required field missing

### Authentication and Authorization

- `AUTHENTICATION_ERROR`: Authentication required
- `AUTHORIZATION_ERROR`: Access denied
- `TOKEN_EXPIRED`: Authentication token expired
- `INVALID_CREDENTIALS`: Invalid login credentials

### HTTP Status

- `NOT_FOUND_ERROR`: Resource not found (404)
- `SERVER_ERROR`: Internal server error (500)
- `BAD_REQUEST`: Invalid request (400)
- `CONFLICT_ERROR`: Resource conflict (409)

### Business Logic

- `BUSINESS_LOGIC_ERROR`: General business rule violation
- `BOOKING_UNAVAILABLE`: Booking no longer available
- `PAYMENT_FAILED`: Payment processing failed
- `DOCUMENT_VERIFICATION_FAILED`: Document verification failed

### File Upload

- `FILE_TOO_LARGE`: File exceeds size limit
- `INVALID_FILE_TYPE`: File type not allowed
- `FILE_UPLOAD_FAILED`: Upload process failed
- `FILE_CORRUPTED`: File appears corrupted

### Tenant and Configuration

- `TENANT_ERROR`: General tenant issue
- `TENANT_NOT_FOUND`: Tenant not found
- `TENANT_CONFIGURATION_ERROR`: Tenant config invalid

### Rate Limiting

- `RATE_LIMITED`: Too many requests
- `QUOTA_EXCEEDED`: Usage quota exceeded

### OTP Specific

- `OTP_INVALID`: Invalid verification code
- `OTP_EXPIRED`: Verification code expired
- `OTP_MAX_ATTEMPTS`: Too many failed attempts

## Retry Logic

### Retry Configuration

```typescript
interface RetryConfig {
  shouldRetry: boolean
  delay: number
  maxAttempts: number
}
```

### Retryable Errors

- Network errors (connection, timeout, DNS)
- Server errors (5xx status codes)
- Rate limiting errors
- File upload failures (network-related)

### Non-Retryable Errors

- Validation errors
- Authentication errors
- Business logic errors
- Client errors (4xx except 429)

### Exponential Backoff

The system uses exponential backoff for retry delays:

```
delay = baseDelay * (backoffFactor ^ attemptCount)
```

Default configuration:

- Base delay: 1000ms
- Backoff factor: 2
- Max delay: 10000ms
- Max attempts: 3

## User-Friendly Messages

The system provides user-friendly error messages for all error codes:

```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'Connection problem. Please check your internet connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Please log in to continue.',
  FILE_TOO_LARGE:
    "The file you're trying to upload is too large. Maximum size is 10MB.",
  BOOKING_UNAVAILABLE: 'The selected booking is no longer available.',
  // ... more messages
}
```

## Configuration

### ErrorHandler Configuration

```typescript
interface ErrorHandlerConfig {
  enableRetry: boolean
  maxRetries: number
  retryDelay: number
  backoffFactor: number
  maxRetryDelay: number
  enableLogging: boolean
}
```

### Default Configurations

- **Default Handler**: General purpose with standard retry policy
- **File Upload Handler**: Extended retries and timeouts
- **Auth Handler**: No retries for security
- **Payment Handler**: Conservative retry policy
- **Realtime Handler**: Fast retries for real-time services

## Best Practices

### Error Creation

1. Use the ErrorFactory for consistent error creation
2. Include relevant context information
3. Use appropriate error types for different scenarios
4. Provide meaningful error messages

### Error Handling

1. Always handle errors at the service boundary
2. Use appropriate error handlers for different service types
3. Implement proper retry logic for transient errors
4. Log errors with sufficient context for debugging

### User Experience

1. Show user-friendly error messages
2. Provide actionable guidance when possible
3. Handle loading states during retries
4. Implement proper error boundaries in React components

### Monitoring

1. Enable logging in production environments
2. Monitor error rates and patterns
3. Set up alerts for critical errors
4. Track retry success rates

## Testing

The error handling system includes comprehensive unit tests covering:

- Error classification and handling
- Retry logic and exponential backoff
- User-friendly message mapping
- Error factory utilities
- Edge cases and error scenarios

Run tests with:

```bash
npm test -- lib/services/base/__tests__/error-handler.test.ts
npm test -- lib/services/base/__tests__/error-factory.test.ts
```

## Integration

The error handling system integrates with:

- **API Client**: Automatic error handling for HTTP requests
- **React Query**: Error handling for data fetching
- **Server Actions**: Error handling for form submissions
- **File Upload Service**: Specialized file upload error handling
- **Authentication Service**: Auth-specific error handling

## Troubleshooting

### Common Issues

1. **Errors not being retried**: Check if error is classified as retryable
2. **Incorrect error messages**: Verify error code mapping
3. **Missing context**: Ensure RequestContext is properly provided
4. **Retry loops**: Check max retry limits and backoff configuration

### Debugging

1. Enable logging to see error classification
2. Check error details for additional context
3. Verify tenant context is properly set
4. Monitor network conditions for connectivity issues

## Future Enhancements

Potential improvements to the error handling system:

1. **Circuit Breaker**: Prevent cascading failures
2. **Error Aggregation**: Batch similar errors
3. **Custom Error Pages**: Branded error experiences
4. **Error Analytics**: Detailed error reporting
5. **Internationalization**: Multi-language error messages
