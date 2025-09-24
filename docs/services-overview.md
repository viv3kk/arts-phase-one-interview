# Service Layer

This directory contains the service layer implementation for the multi-tenant car rental storefront. The service layer provides type-safe, tenant-aware API integration that abstracts backend communication.

## Structure

```
lib/services/
├── base/                   # Base infrastructure
│   ├── types.ts           # Core types and interfaces
│   ├── api-client.ts      # HTTP client (to be implemented)
│   ├── interceptors.ts    # Request/response middleware (to be implemented)
│   └── error-handler.ts   # Error handling (to be implemented)
├── auth/                   # Authentication services
├── renter/                 # Renter management services
├── checkout/               # Payment and checkout services
├── upload/                 # File upload services
└── index.ts               # Service exports
```

## Configuration

- `lib/config/api-endpoints.ts` - API endpoint definitions
- `lib/config/service-config.ts` - Service layer configuration

## Type Generation

Run `npm run generate:types` to generate TypeScript types from the OpenAPI specification.

## Usage

Services are designed to work in both client and server environments:

```typescript
// Client-side with React Query
const { data } = useQuery(['profile'], () => renterService.getProfile())

// Server-side in Server Actions
const profile = await renterService.getProfile()
```

## Features

- ✅ Type-safe API integration
- ✅ Multi-tenant context injection
- ✅ Automatic error handling
- ✅ Request/response interceptors
- ✅ Retry logic with exponential backoff
- ✅ Request deduplication
- ✅ React Query integration
- ✅ Server Actions support

## Development

This service layer is currently under development. Services will be implemented incrementally according to the implementation plan in `.kiro/specs/service-layer/tasks.md`.
