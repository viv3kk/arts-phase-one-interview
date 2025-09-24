/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Unit tests for interceptor system
 * Tests request/response interceptors and middleware functionality
 * Requirements: 1.1, 1.6
 */

import {
  InterceptorManager,
  createCacheControlInterceptor,
  createDeduplicationInterceptor,
  createDefaultErrorInterceptors,
  createDefaultRequestInterceptors,
  createDefaultResponseInterceptors,
} from '../interceptors'
import { DefaultTenantResolver } from '../tenant-context'
import { RequestConfig, RequestContext, TenantContext } from '../types'

// Mock tenant utilities
jest.mock('../../../tenant', () => ({
  getTenantConfig: jest.fn(),
  extractTenantFromHostname: jest.fn(),
}))

// Mock document for cookie tests
;(global as any).document = {
  cookie: 'auth_token=test-token-123; other_cookie=value',
}

describe('InterceptorManager', () => {
  let manager: InterceptorManager
  let mockContext: RequestContext

  beforeEach(() => {
    manager = new InterceptorManager()
    mockContext = {
      requestId: 'test-request-123',
      timestamp: '2023-01-01T00:00:00.000Z',
      tenantId: 'test-tenant',
    }
  })

  describe('request interceptors', () => {
    test('should process request through interceptors in order', async () => {
      const interceptor1 = jest.fn().mockImplementation((url, config) => ({
        url: url + '?param1=value1',
        config: {
          ...config,
          headers: { ...config.headers, 'Header-1': 'value1' },
        },
      }))

      const interceptor2 = jest.fn().mockImplementation((url, config) => ({
        url: url + '&param2=value2',
        config: {
          ...config,
          headers: { ...config.headers, 'Header-2': 'value2' },
        },
      }))

      manager.addRequestInterceptor(interceptor1)
      manager.addRequestInterceptor(interceptor2)

      const result = await manager.processRequest('/test', {}, mockContext)

      expect(interceptor1).toHaveBeenCalledWith('/test', {}, mockContext)
      expect(interceptor2).toHaveBeenCalledWith(
        '/test?param1=value1',
        expect.any(Object),
        mockContext,
      )

      expect(result.url).toBe('/test?param1=value1&param2=value2')
      expect(result.config.headers).toEqual({
        'Header-1': 'value1',
        'Header-2': 'value2',
      })
    })

    test('should handle async interceptors', async () => {
      const asyncInterceptor = jest
        .fn()
        .mockImplementation(async (url, config) => {
          await new Promise(resolve => setTimeout(resolve, 10))
          return { url: url + '?async=true', config }
        })

      manager.addRequestInterceptor(asyncInterceptor)

      const result = await manager.processRequest('/test', {}, mockContext)

      expect(result.url).toBe('/test?async=true')
    })
  })

  describe('response interceptors', () => {
    test('should process response through interceptors', async () => {
      const interceptor1 = jest.fn().mockImplementation(response => ({
        ...response,
        processed: true,
      }))

      const interceptor2 = jest.fn().mockImplementation(response => ({
        ...response,
        transformed: true,
      }))

      manager.addResponseInterceptor(interceptor1)
      manager.addResponseInterceptor(interceptor2)

      const mockResponse = { data: 'test', status: 200 }
      const result = await manager.processResponse(mockResponse, mockContext)

      expect(result).toEqual({
        data: 'test',
        status: 200,
        processed: true,
        transformed: true,
      })
    })
  })

  describe('error interceptors', () => {
    test('should process errors through interceptors', async () => {
      const interceptor1 = jest.fn().mockImplementation(error => ({
        ...error,
        processed: true,
      }))

      const interceptor2 = jest.fn().mockImplementation(error => ({
        ...error,
        code: 'PROCESSED_ERROR',
      }))

      manager.addErrorInterceptor(interceptor1)
      manager.addErrorInterceptor(interceptor2)

      const mockError = { message: 'Test error' }
      const result = await manager.processError(mockError, mockContext)

      expect(result).toEqual({
        message: 'Test error',
        processed: true,
        code: 'PROCESSED_ERROR',
      })
    })
  })

  describe('clear', () => {
    test('should clear all interceptors', () => {
      manager.addRequestInterceptor(() => ({ url: '', config: {} }))
      manager.addResponseInterceptor(response => response)
      manager.addErrorInterceptor(error => error)

      manager.clear()

      // After clearing, no interceptors should be called
      const result1 = manager.processRequest('/test', {}, mockContext)
      const result2 = manager.processResponse({}, mockContext)
      const result3 = manager.processError({}, mockContext)

      expect(result1).resolves.toEqual({ url: '/test', config: {} })
      expect(result2).resolves.toEqual({})
      expect(result3).resolves.toEqual({})
    })
  })
})

describe('Default Request Interceptors', () => {
  let tenantResolver: DefaultTenantResolver
  let mockContext: RequestContext

  beforeEach(() => {
    tenantResolver = new DefaultTenantResolver()
    mockContext = {
      requestId: 'test-request-123',
      timestamp: '2023-01-01T00:00:00.000Z',
    }
  })

  test('should inject tenant context', async () => {
    const tenantContext: TenantContext = {
      tenantId: 'test-tenant',
      subdomain: 'test',
      config: {} as any,
    }

    jest.spyOn(tenantResolver, 'resolve').mockResolvedValue(tenantContext)

    const interceptors = createDefaultRequestInterceptors(tenantResolver, false)
    const tenantInterceptor = interceptors[0]

    const result = await tenantInterceptor('/test', {}, mockContext)

    expect(result.config.headers).toEqual({
      'X-Tenant-ID': 'test-tenant',
      'X-Tenant-Subdomain': 'test',
    })
    expect(mockContext.tenantId).toBe('test-tenant')
  })

  test('should inject request ID', async () => {
    const interceptors = createDefaultRequestInterceptors(tenantResolver, false)
    const requestIdInterceptor = interceptors[1]

    const result = await requestIdInterceptor('/test', {}, mockContext)

    expect(result.config.headers).toEqual({
      'X-Request-ID': 'test-request-123',
    })
  })

  test('should inject authentication token from cookies', async () => {
    const interceptors = createDefaultRequestInterceptors(tenantResolver, false)
    const authInterceptor = interceptors[2]

    const result = await authInterceptor('/api/profile', {}, mockContext)

    expect(result.config.headers).toEqual({
      Authorization: 'Bearer test-token-123',
    })
  })

  test('should skip auth injection for auth endpoints', async () => {
    const interceptors = createDefaultRequestInterceptors(tenantResolver, false)
    const authInterceptor = interceptors[2]

    const result = await authInterceptor('/auth/login', {}, mockContext)

    expect(result.config.headers).toBeUndefined()
  })

  test('should log requests when logging enabled', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    const interceptors = createDefaultRequestInterceptors(tenantResolver, true)
    const loggingInterceptor = interceptors[3]

    await loggingInterceptor('/test', { method: 'POST' }, mockContext)

    expect(consoleSpy).toHaveBeenCalledWith(
      '[API Request] POST /test',
      expect.objectContaining({
        requestId: 'test-request-123',
        timestamp: '2023-01-01T00:00:00.000Z',
      }),
    )

    consoleSpy.mockRestore()
  })
})

describe('Default Response Interceptors', () => {
  let mockContext: RequestContext

  beforeEach(() => {
    mockContext = {
      requestId: 'test-request-123',
      timestamp: '2023-01-01T00:00:00.000Z',
    }
  })

  test('should log responses when logging enabled', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    const interceptors = createDefaultResponseInterceptors(true)
    const loggingInterceptor = interceptors[0]

    const mockResponse = {
      status: 200,
      statusText: 'OK',
      data: 'test',
    }

    await loggingInterceptor(mockResponse, mockContext)

    expect(consoleSpy).toHaveBeenCalledWith(
      '[API Response] 200 OK',
      expect.objectContaining({
        requestId: 'test-request-123',
        duration: expect.any(Number),
      }),
    )

    consoleSpy.mockRestore()
  })

  test('should transform response to standard format', async () => {
    const interceptors = createDefaultResponseInterceptors(false)
    const transformInterceptor = interceptors[0] // When logging disabled, transform is first

    const mockResponse = {
      data: { message: 'success' },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }

    const result = await transformInterceptor(mockResponse, mockContext)

    expect(result).toEqual({
      data: { message: 'success' },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    })
  })
})

describe('Default Error Interceptors', () => {
  let mockContext: RequestContext

  beforeEach(() => {
    mockContext = {
      requestId: 'test-request-123',
      timestamp: '2023-01-01T00:00:00.000Z',
      tenantId: 'test-tenant',
    }
  })

  test('should log errors when logging enabled', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const interceptors = createDefaultErrorInterceptors(true)
    const loggingInterceptor = interceptors[0]

    const mockError = new Error('Test error')

    await loggingInterceptor(mockError, mockContext)

    expect(consoleSpy).toHaveBeenCalledWith(
      '[API Error]',
      expect.objectContaining({
        requestId: 'test-request-123',
        tenantId: 'test-tenant',
        error: 'Test error',
      }),
    )

    consoleSpy.mockRestore()
  })

  test('should transform error to ServiceError format', async () => {
    const interceptors = createDefaultErrorInterceptors(false)
    const transformInterceptor = interceptors[0] // When logging disabled, transform is first

    const mockError = {
      code: 'NETWORK_ERROR',
      message: 'Connection failed',
      field: 'email',
    }

    const result = await transformInterceptor(mockError, mockContext)

    expect(result).toEqual({
      code: 'NETWORK_ERROR',
      message: 'Connection failed',
      field: 'email',
      details: {},
      timestamp: expect.any(String),
      requestId: 'test-request-123',
      tenantId: 'test-tenant',
    })
  })

  test('should handle unknown errors', async () => {
    const interceptors = createDefaultErrorInterceptors(false)
    const transformInterceptor = interceptors[0]

    const mockError = 'String error'

    const result = await transformInterceptor(mockError, mockContext)

    expect(result).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: {},
      timestamp: expect.any(String),
      requestId: 'test-request-123',
      tenantId: 'test-tenant',
    })
  })
})

describe('Deduplication Interceptor', () => {
  test('should throw error for duplicate requests', async () => {
    const interceptor = createDeduplicationInterceptor()
    const config: RequestConfig = { method: 'GET' }
    const context: RequestContext = {
      requestId: 'test',
      timestamp: '2023-01-01T00:00:00.000Z',
    }

    // First request should pass
    const result1 = await interceptor('/test', config, context)
    expect(result1).toEqual({ url: '/test', config })

    // Second identical request should throw
    await expect(interceptor('/test', config, context)).rejects.toThrow(
      'DUPLICATE_REQUEST',
    )
  })
})

describe('Cache Control Interceptor', () => {
  test('should add cache headers for GET requests', async () => {
    const interceptor = createCacheControlInterceptor()
    const config: RequestConfig = { method: 'GET' }
    const context: RequestContext = {
      requestId: 'test',
      timestamp: '2023-01-01T00:00:00.000Z',
    }

    const result = await interceptor('/test', config, context)

    expect(result.config.headers).toEqual({
      'Cache-Control': 'max-age=300',
    })
  })

  test('should not add cache headers for POST requests', async () => {
    const interceptor = createCacheControlInterceptor()
    const config: RequestConfig = { method: 'POST' }
    const context: RequestContext = {
      requestId: 'test',
      timestamp: '2023-01-01T00:00:00.000Z',
    }

    const result = await interceptor('/test', config, context)

    expect(result.config.headers).toBeUndefined()
  })

  test('should not add cache headers when cache is disabled', async () => {
    const interceptor = createCacheControlInterceptor()
    const config: RequestConfig = { method: 'GET', cache: false }
    const context: RequestContext = {
      requestId: 'test',
      timestamp: '2023-01-01T00:00:00.000Z',
    }

    const result = await interceptor('/test', config, context)

    expect(result.config.headers).toBeUndefined()
  })
})
