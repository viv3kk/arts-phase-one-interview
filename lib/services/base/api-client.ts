/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Simplified API client for auth and user operations
 * Clean, type-safe HTTP client with essential features only
 */

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_DEV_TENANT_ID } from '../../../constants/development'
import {
  API_CONFIG,
  CONTENT_TYPES,
  HTTP_METHODS,
} from '../../config/api-endpoints'
// Auth interceptors removed - products-only app
import { getCurrentEnvironment, getCurrentTenantId } from './tenant-context'
import { ApiClientConfig, RequestConfig, RequestContext } from './types'

// Simplified response structure
export interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// Simplified error structure
export interface ApiError extends Error {
  status?: number
  response?: {
    data: unknown
    status: number
    statusText: string
  }
  isApiError: boolean
}

// Simplified config options
export interface ApiConfig extends RequestConfig {
  url?: string
  method?: string
  baseURL?: string
  params?: Record<string, string | number | boolean>

  data?: any // Keep any for flexibility with different data types
  timeout?: number
  headers?: Record<string, string>
  credentials?: RequestCredentials // ✅ Add credentials support for HTTP-only cookies
}

// Service-level configuration
export interface ServiceConfig {
  credentials?: RequestCredentials
  baseURL?: string
  timeout?: number
}

/**
 * Simplified API client class - focused on auth/user operations
 */
export class ApiClient {
  private config: ApiClientConfig
  private serviceConfig: ServiceConfig
  private authInterceptor?: ((
    url: string,
    config: RequestConfig,
    context: RequestContext,
  ) =>
    | Promise<{ url: string; config: RequestConfig }>
    | { url: string; config: RequestConfig }) | null

  private errorInterceptor?: ((
    error: any,
    context: RequestContext,
  ) => Promise<any> | any) | null

  constructor(config: ApiClientConfig, serviceConfig?: ServiceConfig) {
    this.config = config
    this.serviceConfig = serviceConfig || {}
    // Auth interceptors removed for products-only app
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    url: string,
    config?: Omit<ApiConfig, 'data' | 'method'>,
  ): Promise<T> {
    const response = await this.request<T>({
      ...config,
      url,
      method: HTTP_METHODS.GET,
    })
    return response.data
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiConfig, 'method'>,
  ): Promise<T> {
    const response = await this.request<T>({
      ...config,
      url,
      method: HTTP_METHODS.POST,
      data,
    })
    return response.data
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiConfig, 'method'>,
  ): Promise<T> {
    const response = await this.request<T>({
      ...config,
      url,
      method: HTTP_METHODS.PUT,
      data,
    })
    return response.data
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiConfig, 'method'>,
  ): Promise<T> {
    const response = await this.request<T>({
      ...config,
      url,
      method: HTTP_METHODS.PATCH,
      data,
    })
    return response.data
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    config?: Omit<ApiConfig, 'data' | 'method'>,
  ): Promise<T> {
    const response = await this.request<T>({
      ...config,
      url,
      method: HTTP_METHODS.DELETE,
    })
    return response.data
  }

  /**
   * Core request method
   */
  async request<T = unknown>(config: ApiConfig): Promise<ApiResponse<T>> {
    // console.error('🔥 API CLIENT REQUEST METHOD CALLED 🔥', config.url)
    const requestId = uuidv4()
    const timestamp = new Date().toISOString()

    // Ensure URL is present
    if (!config.url) {
      throw this.createError('URL is required', 400)
    }

    // Create request context
    const context: RequestContext = {
      requestId,
      timestamp,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }

    // Resolve tenant context
    if (this.config.tenantResolver) {
      try {
        const tenantContext = await this.config.tenantResolver.resolve(context)
        if (tenantContext) {
          context.tenantId = tenantContext.tenantId
        }
      } catch (error) {
        console.warn('Failed to resolve tenant context:', error)
      }
    }

    // Apply auth interceptor
    let processedUrl = config.url
    let processedConfig = { ...config }

    if (this.authInterceptor) {
      try {
        const result = await Promise.resolve(
          this.authInterceptor(config.url, config, context),
        )
        processedUrl = result.url
        processedConfig = { ...processedConfig, ...result.config }
      } catch (error) {
        console.warn('Auth interceptor failed:', error)
      }
    }

    // Create full URL with service-level baseURL override
    const baseURL = this.serviceConfig.baseURL || this.config.baseURL
    const fullUrl = processedUrl.startsWith('http')
      ? processedUrl
      : `${baseURL}${processedUrl}`

    // Prepare headers - only add Content-Type for requests with body
    const headers: Record<string, string> = {
      ...processedConfig.headers,
    }

    // Add X-Tenant-ID header for multi-tenant API calls
    const tenantId = this.resolveTenantId()
    const environment = getCurrentEnvironment()

    // Enhanced debug logging for server-side tenant context
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 API CLIENT TENANT DEBUG:', {
        tenantId,
        environment,
        url: config.url,
        isServerSide: typeof window === 'undefined',
        globalTenantContext:
          typeof window === 'undefined' ? getCurrentTenantId() : 'client-side',
      })
    }

    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId
    }

    // Add environment-specific headers if needed
    if (environment !== 'production') {
      headers['X-Environment'] = environment
    }

    // Add query parameters
    const urlWithParams = this.addQueryParams(fullUrl, processedConfig.params)

    // Enhanced debug logging for both development and production
    console.log('🚀 API REQUEST DEBUG START 🚀')
    console.log(
      `API Request - URL: ${urlWithParams}, Tenant: ${tenantId || 'none'}, Environment: ${environment}`,
    )
    console.log('API Request Headers:', {
      'X-Tenant-ID': tenantId || 'none',
      'X-Environment': environment !== 'production' ? environment : 'none',
      'Content-Type': headers['Content-Type'] || 'none',
      Origin: headers['Origin'] || 'none',
    })
    console.log('🔍 Full Headers Object:', headers)
    console.log('🚀 API REQUEST DEBUG END 🚀')

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: processedConfig.method || HTTP_METHODS.GET,
      headers,
      signal: AbortSignal.timeout(
        processedConfig.timeout || this.config.timeout,
      ),
      credentials:
        processedConfig.credentials ||
        this.serviceConfig.credentials ||
        'omit', // ✅ Service-level credentials with fallback
    }

    // Add body and Content-Type for requests that support it
    if (this.shouldHaveBody(processedConfig.method) && processedConfig.data) {
      if (processedConfig.data instanceof FormData) {
        // For FormData, don't set Content-Type (browser handles it)
        fetchOptions.body = processedConfig.data
      } else {
        // For JSON data, set Content-Type and stringify body
        headers['Content-Type'] = CONTENT_TYPES.JSON
        fetchOptions.body = JSON.stringify(processedConfig.data)
      }
    }

    try {
      // Make the request
      const response = await fetch(urlWithParams, fetchOptions)

      // Parse response data
      const data = await this.parseResponse<T>(response)

      // Create response object
      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      }

      // Enhanced debug logging for response (both dev and production)
      console.log(
        `API Response - URL: ${urlWithParams}, Status: ${response.status} ${response.statusText}`,
      )
      console.log('🔍 Response Headers:', this.parseHeaders(response.headers))

      // Check if response is successful
      if (response.status >= 200 && response.status < 300) {
        return apiResponse
      }

      // Enhanced error logging (both dev and production)
      console.error(
        `API Error - URL: ${urlWithParams}, Status: ${response.status}, Data:`,
        data,
      )
      console.error(
        '🔍 Error Response Headers:',
        this.parseHeaders(response.headers),
      )
      throw this.createErrorFromResponse(response, data)
    } catch (error) {
      // Apply error interceptor if available
      if (this.errorInterceptor) {
        try {
          throw await Promise.resolve(this.errorInterceptor(error, context))
        } catch (interceptedError) {
          throw interceptedError
        }
      }

      // Handle network errors
      if (error instanceof Error && !('isApiError' in error)) {
        throw this.createError(error.message, 0, error)
      }

      throw error
    }
  }

  /**
   * Parse response data
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    if (contentType?.includes('text/')) {
      return (await response.text()) as T
    }

    return (await response.blob()) as T
  }

  /**
   * Parse headers object
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  /**
   * Create API error
   */
  private createError(
    message: string,
    status?: number,
    originalError?: Error,
  ): ApiError {
    const error = new Error(message) as ApiError
    error.status = status
    error.isApiError = true

    if (originalError) {
      error.stack = originalError.stack
    }

    return error
  }

  /**
   * Create error from response
   */
  private createErrorFromResponse(response: Response, data: unknown): ApiError {
    const message = `Request failed with status ${response.status}`
    const error = this.createError(message, response.status)

    error.response = {
      data,
      status: response.status,
      statusText: response.statusText,
    }

    return error
  }

  /**
   * Add query parameters to URL
   */
  private addQueryParams(
    url: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return url
    }

    const urlObj = new URL(url)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value))
      }
    })

    return urlObj.toString()
  }

  /**
   * Check if method should have a body
   */
  private shouldHaveBody(method?: string): boolean {
    return ['POST', 'PUT', 'PATCH'].includes(method?.toUpperCase() || '')
  }

  /**
   * Centralized tenant ID resolution that works in all environments
   * This is the single source of truth for tenant ID detection
   */
  private resolveTenantId(): string | null {
    console.log('🔍 RESOLVING TENANT ID - START')

    // Server-side: Try multiple resolution strategies
    if (typeof window === 'undefined') {
      console.log('🔍 SERVER-SIDE TENANT RESOLUTION')

      // Strategy 1: Global tenant context (set by middleware)
      const globalTenantId = getCurrentTenantId()
      console.log('🔍 Strategy 1 - Global Context:', globalTenantId)
      if (globalTenantId) {
        console.log('✅ TENANT ID RESOLVED: Global Context ->', globalTenantId)
        return globalTenantId
      }

      // Strategy 2: Extract from Vercel environment variables
      const vercelTenantId = this.extractTenantFromVercelEnvironment()
      console.log('🔍 Strategy 2 - Vercel Environment:', vercelTenantId)
      if (vercelTenantId) {
        console.log(
          '✅ TENANT ID RESOLVED: Vercel Environment ->',
          vercelTenantId,
        )
        return vercelTenantId
      }

      // Strategy 3: Development fallback
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '🔍 Strategy 3 - Development Fallback:',
          DEFAULT_DEV_TENANT_ID,
        )
        console.log(
          '✅ TENANT ID RESOLVED: Development Fallback ->',
          DEFAULT_DEV_TENANT_ID,
        )
        return DEFAULT_DEV_TENANT_ID
      }

      console.log('❌ NO TENANT ID RESOLVED - All strategies failed')
      return null
    }

    // Client-side: Extract tenant ID from current URL
    console.log('🔍 CLIENT-SIDE TENANT RESOLUTION')
    const hostname = window.location.hostname
    console.log('🔍 Client Hostname:', hostname)

    // Extract tenant from subdomain patterns
    const clientTenantId = this.extractTenantFromHostname(hostname)
    console.log('🔍 Client Tenant ID:', clientTenantId)

    if (clientTenantId) {
      console.log('✅ TENANT ID RESOLVED: Client-side ->', clientTenantId)
      return clientTenantId
    }

    // Development fallback for client-side
    if (hostname.includes('localhost')) {
      console.log(
        '✅ TENANT ID RESOLVED: Client Development Fallback ->',
        DEFAULT_DEV_TENANT_ID,
      )
      return DEFAULT_DEV_TENANT_ID
    }

    console.log('❌ NO TENANT ID RESOLVED - Client-side strategies failed')
    return null
  }

  /**
   * Extract tenant ID from Vercel environment variables
   * This is a fallback method for server-side tenant resolution
   */
  private extractTenantFromVercelEnvironment(): string | null {
    // Check if we're in a server environment with access to environment variables
    if (typeof process !== 'undefined' && process.env) {
      // Check for Vercel-specific environment variables
      const vercelUrl = process.env.VERCEL_URL
      const vercelHost = process.env.HOST
      const vercelEnv = process.env.VERCEL_ENV

      console.log('🔍 VERCEL ENVIRONMENT CHECK:', {
        vercelUrl,
        vercelHost,
        vercelEnv,
        nodeEnv: process.env.NODE_ENV,
      })

      // Strategy 1: Extract from VERCEL_URL
      if (vercelUrl) {
        const tenantId = this.extractTenantFromHostname(vercelUrl)
        if (tenantId) {
          console.log('🔍 EXTRACTED TENANT FROM VERCEL_URL:', tenantId)
          return tenantId
        }
      }

      // Strategy 2: Extract from HOST environment variable
      if (vercelHost) {
        const tenantId = this.extractTenantFromHostname(vercelHost)
        if (tenantId) {
          console.log('🔍 EXTRACTED TENANT FROM HOST:', tenantId)
          return tenantId
        }
      }

      // Strategy 3: Try to extract from request headers (if available)
      // This would require access to the request object, which might not be available in all contexts
      console.log('🔍 No tenant ID found in Vercel environment variables')
    }

    return null
  }

  /**
   * Extract tenant ID from hostname using the same logic as tenant-context
   */
  private extractTenantFromHostname(hostname: string): string | null {
    const patterns = [
      /^([a-z0-9-]+)\.qa\.htravelss\.com$/i, // qa environment
      /^([a-z0-9-]+)\.htravelss\.com$/i, // production environment
      /^([a-z0-9-]+)\.localhost$/i, // local development
      /^([a-z0-9-]+)\.localhost:\d+$/i, // local development with port
    ]

    for (const pattern of patterns) {
      const match = hostname.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }


  /**
   * Update client configuration
   */
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current config
   */
  getConfig(): ApiClientConfig {
    return { ...this.config }
  }
}

/**
 * Create API client instance
 */
export function createApiClient(
  config: ApiClientConfig,
  serviceConfig?: ServiceConfig,
): ApiClient {
  return new ApiClient(config, serviceConfig)
}

/**
 * Create shared API client with auth interceptors
 */
export function createSharedApiClient(
  serviceConfig?: ServiceConfig,
): ApiClient {
  return createApiClient(
    {
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY,
      // tenantResolver: handled by global tenant context
      enableLogging: process.env.NODE_ENV === 'development',
      enableCaching: false, // Simplified - no caching
    },
    serviceConfig,
  )
}

/**
 * Global shared API client instance
 */
export const sharedApiClient = createSharedApiClient()
