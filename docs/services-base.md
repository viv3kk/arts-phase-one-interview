# Service Layer Base Components

This directory contains the core API client implementation with tenant context support.

## ✅ Implemented Components

### 1. ApiClient (`api-client.ts`)

- **HTTP Methods**: GET, POST, PUT, DELETE
- **File Upload**: Single and multiple file upload support
- **Tenant Context**: Automatic tenant header injection
- **Request Deduplication**: Prevents duplicate concurrent GET requests
- **Retry Logic**: Configurable retry with exponential backoff
- **Error Handling**: Comprehensive error classification and transformation

### 2. Tenant Context System (`tenant-context.ts`)

- **DefaultTenantResolver**: Client-side tenant resolution
- **ServerTenantResolver**: Next.js server-side tenant resolution
- **Multiple Resolution Strategies**: Headers, hostname, URL-based
- **Header Injection**: Automatic `X-Tenant-ID` and `X-Tenant-Subdomain` headers

### 3. Interceptor Architecture (`interceptors.ts`)

- **InterceptorManager**: Middleware system for requests/responses
- **Default Interceptors**: Tenant context, authentication, logging
- **Extensible**: Easy to add custom interceptors
- **Request/Response/Error Processing**: Full pipeline support

### 4. Error Handling (`error-handler.ts`)

- **Error Classification**: Network, validation, authentication, HTTP errors
- **Retry Logic**: Smart retry with exponential backoff
- **User-Friendly Messages**: Mapped error codes to readable messages
- **Configurable**: Customizable retry attempts and delays

### 5. Type Definitions (`types.ts`)

- **Complete TypeScript Support**: Full type safety
- **API Response Types**: Standardized response format
- **Error Types**: Structured error interfaces
- **Configuration Types**: Type-safe configuration options

## 🧪 Test Coverage

- **Unit Tests**: Comprehensive test suites for all components
- **Integration Tests**: End-to-end API client functionality
- **Error Scenarios**: Network failures, HTTP errors, validation errors
- **Tenant Context**: Multi-tenant request handling

## 🚀 Usage Example

```typescript
import { createApiClient } from './lib/services/base/api-client'
import { createTenantResolver } from './lib/services/base/tenant-context'
import { API_CONFIG } from './lib/config/api-endpoints'

// Create API client with tenant support
const apiClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
  retryDelay: API_CONFIG.RETRY_DELAY,
  tenantResolver: createTenantResolver(),
  enableLogging: true,
  enableCaching: true,
})

// Make tenant-aware API requests
const response = await apiClient.get('/api/bookings')
const booking = await apiClient.post('/api/bookings', bookingData)
const file = await apiClient.upload('/api/upload', fileData)
```

## ✅ Requirements Satisfied

- **1.1**: Base API client with HTTP methods and tenant context injection ✅
- **1.6**: Request deduplication and retry logic with exponential backoff ✅
- **8.1**: Automatic tenant context injection via headers ✅
- **8.2**: Tenant context resolver with multiple resolution strategies ✅

## 🔧 Configuration

The API client is highly configurable through the `ApiClientConfig` interface:

- **baseURL**: API server base URL
- **timeout**: Request timeout in milliseconds
- **retryAttempts**: Maximum retry attempts
- **retryDelay**: Initial retry delay
- **tenantResolver**: Tenant context resolution strategy
- **enableLogging**: Request/response logging
- **enableCaching**: Response caching support

## 🏗️ Architecture

The implementation follows a modular architecture:

1. **Core Client**: HTTP request handling with fetch API
2. **Interceptor System**: Middleware for request/response processing
3. **Tenant Resolution**: Multi-strategy tenant identification
4. **Error Handling**: Comprehensive error classification and retry logic
5. **Type Safety**: Full TypeScript support throughout

This provides a robust, production-ready foundation for the multi-tenant car rental platform's service layer.
