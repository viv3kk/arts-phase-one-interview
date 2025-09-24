/**
 * Request/response interceptor architecture
 * Provides middleware system for API client requests and responses
 * Requirements: 1.1, 1.6
 */

import { REQUEST_HEADERS } from '../../config/api-endpoints'
import { injectTenantHeaders } from './tenant-context'
import {
  RequestConfig,
  RequestContext,
  ServiceError,
  TenantResolver,
} from './types'

// Interceptor function types
export type RequestInterceptor = (
  url: string,
  config: RequestConfig,
  context: RequestContext,
) =>
  | Promise<{ url: string; config: RequestConfig }>
  | { url: string; config: RequestConfig }

export type ResponseInterceptor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  context: RequestContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any> | any

export type ErrorInterceptor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  context: RequestContext,
) => Promise<ServiceError> | ServiceError

/**
 * Interceptor manager for handling request/response middleware
 */
export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor)
  }

  /**
   * Process request through all request interceptors
   */
  async processRequest(
    url: string,
    config: RequestConfig,
    context: RequestContext,
  ): Promise<{ url: string; config: RequestConfig }> {
    let processedUrl = url
    let processedConfig = { ...config }

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(processedUrl, processedConfig, context)
      processedUrl = result.url
      processedConfig = result.config
    }

    return { url: processedUrl, config: processedConfig }
  }

  /**
   * Process response through all response interceptors
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async processResponse(response: any, context: RequestContext): Promise<any> {
    let processedResponse = response

    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse, context)
    }

    return processedResponse
  }

  /**
   * Process error through all error interceptors
   */
  async processError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    context: RequestContext,
  ): Promise<ServiceError> {
    let processedError = error

    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError, context)
    }

    return processedError
  }

  /**
   * Clear all interceptors
   */
  clear(): void {
    this.requestInterceptors = []
    this.responseInterceptors = []
    this.errorInterceptors = []
  }
}

/**
 * Create default request interceptors
 */
export function createDefaultRequestInterceptors(
  tenantResolver: TenantResolver,
  enableLogging: boolean = false,
): RequestInterceptor[] {
  const interceptors: RequestInterceptor[] = []

  // Tenant context injection interceptor
  interceptors.push(async (url, config, context) => {
    const tenantContext = await tenantResolver.resolve(context)

    const updatedConfig = {
      ...config,
      headers: injectTenantHeaders(config.headers || {}),
    }

    // Add tenant context to request context for logging
    if (tenantContext) {
      context.tenantId = tenantContext.tenantId
    }

    return { url, config: updatedConfig }
  })

  // Request ID injection interceptor
  interceptors.push((url, config, context) => {
    const updatedConfig = {
      ...config,
      headers: {
        ...config.headers,
        [REQUEST_HEADERS.REQUEST_ID]: context.requestId,
      },
    }

    return { url, config: updatedConfig }
  })

  // Request logging interceptor
  if (enableLogging) {
    interceptors.push((url, config, context) => {
      console.log(`[API Request] ${config.method || 'GET'} ${url}`, {
        requestId: context.requestId,
        tenantId: context.tenantId,
        timestamp: context.timestamp,
      })

      return { url, config }
    })
  }

  return interceptors
}

/**
 * Create default response interceptors
 */
export function createDefaultResponseInterceptors(
  enableLogging: boolean = false,
): ResponseInterceptor[] {
  const interceptors: ResponseInterceptor[] = []

  // Response logging interceptor
  if (enableLogging) {
    interceptors.push((response, _context) => {
      console.log(`[API Response] ${response.status} ${response.statusText}`, {
        requestId: _context.requestId,
        tenantId: _context.tenantId,
        duration: Date.now() - new Date(_context.timestamp).getTime(),
      })

      return response
    })
  }

  // Response transformation interceptor
  interceptors.push((response, _context) => {
    // Transform response to standard format
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers || {},
    }
  })

  return interceptors
}

/**
 * Create default error interceptors
 */
export function createDefaultErrorInterceptors(
  enableLogging: boolean = false,
): ErrorInterceptor[] {
  const interceptors: ErrorInterceptor[] = []

  // Error logging interceptor
  if (enableLogging) {
    interceptors.push((error, context) => {
      console.error(`[API Error]`, {
        requestId: context.requestId,
        tenantId: context.tenantId,
        error: error.message || error,
        timestamp: new Date().toISOString(),
      })

      return error
    })
  }

  // Error transformation interceptor
  interceptors.push((error, context) => {
    // Transform error to standard ServiceError format
    const serviceError: ServiceError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: error.details || {},
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      tenantId: context.tenantId,
    }

    // Add field information for validation errors
    if (error.field) {
      serviceError.field = error.field
    }

    return serviceError
  })

  return interceptors
}

/**
 * Request deduplication interceptor
 * Prevents duplicate concurrent requests
 */
export function createDeduplicationInterceptor(): RequestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingRequests = new Map<string, Promise<any>>()

  return async (url, config, _context) => {
    // Create request key for deduplication
    const requestKey = `${config.method || 'GET'}:${url}:${JSON.stringify(config.headers || {})}`

    // Check if identical request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log(`[Deduplication] Reusing pending request: ${requestKey}`)
      // Return the existing promise (this will be handled by the caller)
      throw new Error('DUPLICATE_REQUEST')
    }

    return { url, config }
  }
}

/**
 * Cache control interceptor
 * Adds cache headers based on configuration
 */
export function createCacheControlInterceptor(): RequestInterceptor {
  return (url, config, _context) => {
    // Add cache control headers for GET requests
    if ((config.method || 'GET') === 'GET' && config.cache !== false) {
      const updatedConfig = {
        ...config,
        headers: {
          ...config.headers,
          'Cache-Control': 'max-age=300', // 5 minutes default
        },
      }
      return { url, config: updatedConfig }
    }

    return { url, config }
  }
}
