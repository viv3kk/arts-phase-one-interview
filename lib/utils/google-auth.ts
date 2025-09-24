/**
 * Google Authentication Utility
 * Handles Google OAuth client initialization and sign-in flow
 * Uses Google Identity Services for reliable authentication
 */

// Google OAuth client configuration
const GOOGLE_CLIENT_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  scope: 'openid email profile',
}

/**
 * Google authentication result
 */
export interface GoogleAuthResult {
  success: boolean
  user?: GoogleUser
  error?: string
}

/**
 * Google user information
 */
export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
  idToken: string
}

/**
 * Google notification response
 */
interface GoogleNotification {
  isNotDisplayed(): boolean
  isSkippedMoment(): boolean
  isDismissedMoment(): boolean
  getMomentType(): string
}

/**
 * Google credential response
 */
interface GoogleCredentialResponse {
  credential: string
  select_by?: string
}

/**
 * Google JWT payload
 */
interface GoogleJwtPayload {
  sub: string
  email: string
  name: string
  picture?: string
  email_verified: boolean
  iss: string
  aud: string
  exp: number
  iat: number
}

/**
 * Google Identity Services configuration
 */
interface GoogleIdConfig {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

/**
 * Google OAuth client interface
 */
export interface GoogleOAuthClient {
  init(): Promise<void>
  signIn(): Promise<GoogleAuthResult>
  signOut(): Promise<void>
  isSignedIn(): boolean
  getCurrentUser(): GoogleUser | null
}

/**
 * Google OAuth client implementation
 */
class GoogleOAuthClientImpl implements GoogleOAuthClient {
  private isInitialized = false
  private currentUser: GoogleUser | null = null
  private resolveSignIn: ((result: GoogleAuthResult) => void) | null = null

  /**
   * Initialize Google OAuth client
   */
  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Google Identity Services script
      await this.loadGoogleScript()

      // Initialize Google Identity Services
      await this.initializeGoogleIdentity()

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Google OAuth client:', error)
      throw new Error('Google OAuth initialization failed')
    }
  }

  /**
   * Load Google Identity Services script
   */
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true

      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google script'))

      document.head.appendChild(script)
    })
  }

  /**
   * Initialize Google Identity Services
   */
  private async initializeGoogleIdentity(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Wait for Google Identity Services to be available
      const checkGoogle = () => {
        if (window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_CONFIG.clientId,
              callback: this.handleCredentialResponse.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true,
            })
            resolve()
          } catch (error) {
            reject(error)
          }
        } else {
          setTimeout(checkGoogle, 100)
        }
      }

      checkGoogle()
    })
  }

  /**
   * Sign in with Google using Google Identity Services (fallback method)
   */
  async signInWithGoogleIdentity(): Promise<GoogleAuthResult> {
    if (!this.isInitialized) {
      await this.init()
    }

    try {
      return new Promise(resolve => {
        this.resolveSignIn = resolve

        if (!window.google?.accounts?.id) {
          resolve({
            success: false,
            error: 'Google OAuth not initialized',
          })
          return
        }

        window.google.accounts.id.prompt((notification: GoogleNotification) => {
          if (notification.isNotDisplayed()) {
            resolve({
              success: false,
              error: 'Google Sign-In was not displayed',
            })
          } else if (notification.isSkippedMoment()) {
            resolve({
              success: false,
              error: 'Google Sign-In was skipped',
            })
          } else if (notification.isDismissedMoment()) {
            resolve({
              success: false,
              error: 'Google Sign-In was dismissed',
            })
          }
        })
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Sign-In failed',
      }
    }
  }

  /**
   * Handle Google credential response
   */
  private handleCredentialResponse(response: GoogleCredentialResponse): void {
    try {
      // Decode JWT token to get user information
      const payload = this.decodeJwtToken(response.credential)

      this.currentUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        idToken: response.credential,
      }

      // Resolve the sign-in promise
      if (this.resolveSignIn) {
        this.resolveSignIn({
          success: true,
          user: this.currentUser,
        })
        this.resolveSignIn = null
      }
    } catch (error) {
      console.error('Failed to handle Google credential response:', error)
      if (this.resolveSignIn) {
        this.resolveSignIn({
          success: false,
          error: 'Failed to process Google response',
        })
        this.resolveSignIn = null
      }
    }
  }

  /**
   * Decode JWT token
   */
  private decodeJwtToken(token: string): GoogleJwtPayload {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )
      return JSON.parse(jsonPayload)
    } catch {
      throw new Error('Invalid JWT token')
    }
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<GoogleAuthResult> {
    if (!this.isInitialized) {
      await this.init()
    }

    try {
      return new Promise(resolve => {
        this.resolveSignIn = resolve

        // Create custom popup window with same size as login modal
        const popupWidth = 568 // Same width as your login modal
        const popupHeight = 600 // Height for Google OAuth
        const left = (window.screen.width - popupWidth) / 2
        const top = (window.screen.height - popupHeight) / 2

        // Build Google OAuth URL with proper OAuth2 flow
        const googleOAuthUrl =
          'https://accounts.google.com/o/oauth2/auth?' +
          'client_id=' +
          encodeURIComponent(GOOGLE_CLIENT_CONFIG.clientId) +
          '&redirect_uri=' +
          encodeURIComponent(window.location.origin + '/auth/google/callback') +
          '&scope=' +
          encodeURIComponent(GOOGLE_CLIENT_CONFIG.scope) +
          '&response_type=code' +
          '&access_type=offline' +
          '&prompt=select_account'

        const popup = window.open(
          googleOAuthUrl,
          'googleOAuth',
          `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,centerscreen=yes`,
        )

        if (!popup) {
          resolve({
            success: false,
            error:
              'Popup blocked by browser. Please allow popups for this site.',
          })
          return
        }

        // Handle popup messages and closure
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return

          console.log('Received message from popup:', event.data)

          if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
            const { credential } = event.data
            console.log('Google OAuth success, authorization code:', credential)
            popup.close()
            window.removeEventListener('message', handleMessage)

            // Exchange authorization code for user info
            this.exchangeCodeForUserInfo(credential)
              .then(user => {
                if (user) {
                  console.log('Successfully created user object:', user)
                  resolve({
                    success: true,
                    user: user,
                  })
                } else {
                  console.error('Failed to create user object')
                  resolve({
                    success: false,
                    error: 'Failed to get user information from Google',
                  })
                }
              })
              .catch(error => {
                console.error('Error exchanging authorization code:', error)
                resolve({
                  success: false,
                  error:
                    error.message || 'Failed to exchange authorization code',
                })
              })
          } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
            console.error('Google OAuth error:', event.data.error)
            popup.close()
            window.removeEventListener('message', handleMessage)
            resolve({
              success: false,
              error: event.data.error || 'Google authentication failed',
            })
          }
        }

        const handlePopupClose = () => {
          window.removeEventListener('message', handleMessage)
          window.removeEventListener('beforeunload', handlePopupClose)
          resolve({
            success: false,
            error: 'Google authentication was cancelled',
          })
        }

        window.addEventListener('message', handleMessage)
        window.addEventListener('beforeunload', handlePopupClose)

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            window.removeEventListener('message', handleMessage)
            window.removeEventListener('beforeunload', handlePopupClose)
            resolve({
              success: false,
              error: 'Google authentication was cancelled',
            })
          }
        }, 1000)
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google Sign-In failed',
      }
    }
  }

  /**
   * Generate a random nonce for security
   */
  private generateNonce(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }

  /**
   * Exchange authorization code for user information
   */
  private async exchangeCodeForUserInfo(
    authorizationCode: string,
  ): Promise<GoogleUser | null> {
    try {
      // Create a minimal user object with just the authorization code
      // The backend will exchange this code for actual user data from Google
      const user: GoogleUser = {
        id: 'temp-' + Date.now(), // Temporary ID - backend will provide real user ID
        idToken: authorizationCode, // This is the authorization code from Google
        email: '', // Backend will get this from Google
        name: '', // Backend will get this from Google
        picture: '', // Backend will get this from Google
      }

      // Store the current user
      this.currentUser = user

      return user
    } catch (error) {
      console.error('Error exchanging authorization code:', error)
      return null
    }
  }

  /**
   * Sign out from Google
   */
  async signOut(): Promise<void> {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    this.currentUser = null
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.currentUser !== null
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleUser | null {
    return this.currentUser
  }
}

/**
 * Global Google OAuth client instance
 */
export const googleOAuthClient = new GoogleOAuthClientImpl()

/**
 * Hook for Google authentication
 */
export function useGoogleAuth() {
  const signIn = async (): Promise<GoogleAuthResult> => {
    try {
      await googleOAuthClient.init()
      return await googleOAuthClient.signIn()
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Google authentication failed',
      }
    }
  }

  const signOut = async (): Promise<void> => {
    await googleOAuthClient.signOut()
  }

  const getCurrentUser = (): GoogleUser | null => {
    return googleOAuthClient.getCurrentUser()
  }

  const isSignedIn = (): boolean => {
    return googleOAuthClient.isSignedIn()
  }

  return {
    signIn,
    signOut,
    getCurrentUser,
    isSignedIn,
  }
}

// Global callback for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: GoogleIdConfig) => void
          prompt: (callback: (notification: GoogleNotification) => void) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}
