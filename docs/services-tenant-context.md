# Tenant Context System Documentation

## 📋 Overview

The Tenant Context System provides comprehensive multi-tenant support for the API client, enabling automatic tenant identification and context injection across all API requests. This system supports both client-side and server-side environments with multiple resolution strategies.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🏢 Tenant Context System                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🔍 Tenant Resolution                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🌐 Hostname │  │ 📋 Headers  │  │ 🔗 URL      │         │
│  │ Subdomain   │  │ X-Tenant-ID │  │ Parameters  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ⚙️ Context Validation                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ✅ Tenant   │  │ ✅ Config   │  │ ✅ Cache    │         │
│  │ Exists      │  │ Valid       │  │ Management  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🔄 Header Injection                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ X-Tenant-ID │  │ X-Tenant-   │  │ 📊 Request  │         │
│  │ Header      │  │ Subdomain   │  │ Context     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Core Components

### 1. **DefaultTenantResolver** (`DefaultTenantResolver`)

**Purpose**: Client-side tenant resolution with multiple fallback strategies.

**Resolution Order**:

1. **Explicit Context**: Direct `tenantId` in context
2. **Request Headers**: `x-tenant-id` header
3. **Hostname**: Subdomain extraction from hostname
4. **URL**: Hostname extraction from URL
5. **Browser Location**: Current window location hostname

**Key Methods**:

```typescript
class DefaultTenantResolver {
  // Resolve tenant context from various sources
  async resolve(context?: any): Promise<TenantContext | null>

  // Get currently cached tenant context
  getCurrentTenant(): TenantContext | null

  // Set tenant context explicitly
  setTenant(tenant: TenantContext): void

  // Clear cached tenant context
  clearTenant(): void
}
```

**Usage Example**:

```typescript
import { DefaultTenantResolver } from './lib/services/base/tenant-context'

const resolver = new DefaultTenantResolver()

// Resolve from current browser location
const tenantContext = await resolver.resolve()

// Resolve from explicit context
const tenantContext = await resolver.resolve({
  tenantId: 'abc-rentals',
  hostname: 'abc-rentals.example.com',
})

// Cache management
resolver.setTenant(tenantContext)
const cached = resolver.getCurrentTenant()
resolver.clearTenant()
```

### 2. **ServerTenantResolver** (`ServerTenantResolver`)

**Purpose**: Next.js server-side tenant resolution with request context support.

**Features**:

- **Next.js Integration**: Works with Next.js request objects
- **Request Headers**: Extracts tenant from request headers
- **Hostname Resolution**: Resolves from request hostname
- **Fallback Support**: Falls back to default resolution

**Usage Example**:

```typescript
import { ServerTenantResolver } from './lib/services/base/tenant-context'

const resolver = new ServerTenantResolver()

// Resolve from Next.js request context
const tenantContext = await resolver.resolve({
  req: {
    headers: {
      host: 'abc-rentals.example.com',
      'x-tenant-id': 'abc-rentals',
    },
  },
})
```

### 3. **Factory Function** (`createTenantResolver`)

**Purpose**: Creates appropriate tenant resolver based on environment.

**Logic**:

- **Server-side**: Returns `ServerTenantResolver`
- **Client-side**: Returns `DefaultTenantResolver`

**Usage Example**:

```typescript
import { createTenantResolver } from './lib/services/base/tenant-context'

// Automatically selects appropriate resolver
const resolver = createTenantResolver()

// Use in API client configuration
const apiClient = createApiClient({
  tenantResolver: createTenantResolver(),
  // ... other config
})
```

## 🔄 Resolution Strategies

### 1. **Subdomain Resolution**

**Pattern**: `{tenant-id}.{domain}.{tld}`

**Examples**:

- `abc-rentals.example.com` → `abc-rentals`
- `xyz-cars.example.com` → `xyz-cars`
- `test-rental.example.com` → `test-rental`

**Implementation**:

```typescript
// Extracts tenant ID from hostname
const tenantId = extractTenantFromHostname('abc-rentals.example.com')
// Returns: 'abc-rentals'
```

### 2. **Header-Based Resolution**

**Headers**:

- `x-tenant-id`: Primary tenant identifier
- `x-tenant-subdomain`: Subdomain information

**Usage**:

```typescript
// Client-side header injection
const headers = {
  'x-tenant-id': 'abc-rentals',
  'x-tenant-subdomain': 'abc-rentals',
}

// Server-side header extraction
const tenantId = req.headers['x-tenant-id']
```

### 3. **URL-Based Resolution**

**Pattern**: Extract hostname from URL and resolve subdomain

**Example**:

```typescript
const url = new URL('https://abc-rentals.example.com/api/bookings')
const tenantId = extractTenantFromHostname(url.hostname)
// Returns: 'abc-rentals'
```

## 🛠️ Utility Functions

### 1. **Header Injection** (`injectTenantHeaders`)

**Purpose**: Automatically injects tenant headers into request headers.

**Function Signature**:

```typescript
function injectTenantHeaders(
  headers: Record<string, string>,
  tenantContext: TenantContext | null,
): Record<string, string>
```

**Usage Example**:

```typescript
import { injectTenantHeaders } from './lib/services/base/tenant-context'

const baseHeaders = { 'Content-Type': 'application/json' }
const tenantContext = {
  tenantId: 'abc-rentals',
  subdomain: 'abc-rentals',
  config: {
    /* tenant config */
  },
}

const enhancedHeaders = injectTenantHeaders(baseHeaders, tenantContext)
// Result:
// {
//   'Content-Type': 'application/json',
//   'X-Tenant-ID': 'abc-rentals',
//   'X-Tenant-Subdomain': 'abc-rentals'
// }
```

### 2. **Context Validation** (`validateTenantContext`)

**Purpose**: Validates tenant context for API requests.

**Function Signature**:

```typescript
function validateTenantContext(tenantContext: TenantContext | null): boolean
```

**Usage Example**:

```typescript
import { validateTenantContext } from './lib/services/base/tenant-context'

const validContext = {
  tenantId: 'abc-rentals',
  config: {
    /* tenant config */
  },
}

const isValid = validateTenantContext(validContext) // true
const isInvalid = validateTenantContext(null) // false
const isEmpty = validateTenantContext({ tenantId: '' }) // false
```

## 🔧 Configuration

### **TenantContext Interface**

```typescript
interface TenantContext {
  tenantId: string // Unique tenant identifier
  subdomain?: string // Optional subdomain
  config: TenantConfig // Tenant configuration
}
```

### **TenantResolver Interface**

```typescript
interface TenantResolver {
  resolve(context?: any): Promise<TenantContext | null>
  getCurrentTenant(): TenantContext | null
  setTenant(tenant: TenantContext): void
  clearTenant(): void
}
```

## 🚀 Integration Examples

### 1. **API Client Integration**

```typescript
import { createApiClient } from './lib/services/base/api-client'
import { createTenantResolver } from './lib/services/base/tenant-context'

// Create tenant-aware API client
const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
  tenantResolver: createTenantResolver(),
  enableLogging: true,
})

// All requests automatically include tenant headers
const bookings = await apiClient.get('/api/bookings')
const newBooking = await apiClient.post('/api/bookings', bookingData)
```

### 2. **Custom Interceptor Integration**

```typescript
import { injectTenantHeaders } from './lib/services/base/tenant-context'

// Custom request interceptor
const tenantInterceptor = async (url: string, config: any, context: any) => {
  const tenantContext = await context.tenantResolver.resolve(context)

  return {
    url,
    config: {
      ...config,
      headers: injectTenantHeaders(config.headers || {}, tenantContext),
    },
  }
}
```

### 3. **Server-Side Usage**

```typescript
import { ServerTenantResolver } from './lib/services/base/tenant-context'

// In Next.js API route
export async function GET(request: Request) {
  const resolver = new ServerTenantResolver()

  const tenantContext = await resolver.resolve({
    req: request,
    hostname: request.headers.get('host'),
    headers: Object.fromEntries(request.headers.entries()),
  })

  if (!tenantContext) {
    return new Response('Tenant not found', { status: 404 })
  }

  // Use tenant context for API logic
  const data = await fetchTenantData(tenantContext.tenantId)
  return Response.json(data)
}
```

## 🧪 Testing

### **Unit Tests**

The tenant context system includes comprehensive unit tests:

```typescript
// tenant-context.test.ts
describe('DefaultTenantResolver', () => {
  test('resolves tenant from hostname', async () => {
    const resolver = new DefaultTenantResolver()
    const context = await resolver.resolve({
      hostname: 'abc-rentals.example.com',
    })
    expect(context?.tenantId).toBe('abc-rentals')
  })

  test('resolves tenant from headers', async () => {
    const resolver = new DefaultTenantResolver()
    const context = await resolver.resolve({
      headers: { 'x-tenant-id': 'xyz-cars' },
    })
    expect(context?.tenantId).toBe('xyz-cars')
  })
})
```

### **Integration Tests**

```typescript
// integration.test.ts
describe('Tenant Context Integration', () => {
  test('API client includes tenant headers', async () => {
    const apiClient = createApiClient({
      tenantResolver: new DefaultTenantResolver(),
    })

    // Mock tenant resolution
    jest.spyOn(apiClient['tenantResolver'], 'resolve').mockResolvedValue({
      tenantId: 'test-tenant',
      config: {
        /* mock config */
      },
    })

    await apiClient.get('/api/test')

    // Verify headers were injected
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Tenant-ID': 'test-tenant',
        }),
      }),
    )
  })
})
```

## 🎯 Best Practices

### 1. **Environment-Specific Resolvers**

```typescript
// Always use createTenantResolver() for automatic environment detection
const resolver = createTenantResolver()

// Don't manually instantiate specific resolvers unless needed
// ❌ const resolver = new DefaultTenantResolver() // Only for client-side
// ❌ const resolver = new ServerTenantResolver()  // Only for server-side
// ✅ const resolver = createTenantResolver()      // Automatic detection
```

### 2. **Error Handling**

```typescript
const resolver = createTenantResolver()

try {
  const tenantContext = await resolver.resolve(context)

  if (!tenantContext) {
    // Handle missing tenant gracefully
    console.warn('No tenant context found, using default')
    return defaultResponse
  }

  // Use tenant context
  return await processWithTenant(tenantContext)
} catch (error) {
  console.error('Tenant resolution failed:', error)
  return errorResponse
}
```

### 3. **Caching Strategy**

```typescript
const resolver = createTenantResolver()

// Cache tenant context for performance
const cachedTenant = resolver.getCurrentTenant()
if (cachedTenant) {
  return cachedTenant
}

// Resolve and cache
const tenantContext = await resolver.resolve(context)
if (tenantContext) {
  resolver.setTenant(tenantContext)
}
return tenantContext
```

### 4. **Validation**

```typescript
import { validateTenantContext } from './lib/services/base/tenant-context'

const tenantContext = await resolver.resolve(context)

if (!validateTenantContext(tenantContext)) {
  throw new Error('Invalid tenant context')
}

// Proceed with valid tenant context
```

## 🔍 Debugging

### **Enable Logging**

```typescript
// Enable debug logging for tenant resolution
const resolver = createTenantResolver()

// Add logging to resolve method
const originalResolve = resolver.resolve.bind(resolver)
resolver.resolve = async context => {
  console.log('Resolving tenant context:', context)
  const result = await originalResolve(context)
  console.log('Resolved tenant context:', result)
  return result
}
```

### **Common Issues**

1. **Missing Tenant**: Check if tenant configuration exists
2. **Invalid Hostname**: Verify subdomain extraction logic
3. **Header Issues**: Ensure headers are properly set
4. **Cache Problems**: Clear cached tenant context if needed

## 📊 Performance Considerations

### **Caching Benefits**

- **Reduced Resolution**: Cache tenant context to avoid repeated resolution
- **Faster Requests**: Pre-resolved context for subsequent requests
- **Memory Efficiency**: Single tenant context per session

### **Memory Management**

```typescript
// Clear cache when switching tenants
resolver.clearTenant()

// Clear cache on logout
const handleLogout = () => {
  resolver.clearTenant()
  // ... other logout logic
}
```

---

## ✅ Requirements Satisfied

- **8.1**: Automatic tenant context injection via headers ✅
- **8.2**: Tenant context resolver with multiple resolution strategies ✅
- **Multi-Environment Support**: Client-side and server-side resolution ✅
- **Error Handling**: Graceful fallback to default tenant ✅
- **Performance**: Caching and optimization ✅
- **Testing**: Comprehensive test coverage ✅

---

_This documentation provides complete coverage of the tenant context system implementation and usage patterns._
