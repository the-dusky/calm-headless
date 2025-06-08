/**
 * Customer Account API Authentication Utilities
 * 
 * This file contains utility functions for working with Shopify's Customer Account API
 * using OAuth2 authentication flow.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Constants for cookie names
const ACCESS_TOKEN_COOKIE = 'shopify_customer_access_token';
const REFRESH_TOKEN_COOKIE = 'shopify_customer_refresh_token';
const CUSTOMER_ID_COOKIE = 'shopify_customer_id';

// Cookie options for secure storage
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  // Set cookies to expire in 30 days
  maxAge: 30 * 24 * 60 * 60,
};

/**
 * Generate the authorization URL for the OAuth2 flow
 * @returns URL to redirect the user to for authentication
 */
export function getAuthorizationUrl() {
  // Ensure required environment variables are set
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID environment variable');
  }
  
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_URL environment variable');
  }
  
  if (!process.env.SHOPIFY_ORIGIN_URL) {
    throw new Error('Missing SHOPIFY_ORIGIN_URL environment variable');
  }

  // Build the authorization URL
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.SHOPIFY_ORIGIN_URL}/authorize`,
    scope: 'openid email profile',
    state: generateRandomState(),
  });

  return `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL}/auth/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange the authorization code for access and refresh tokens
 * @param code - The authorization code received from Shopify
 * @returns Object containing the tokens and customer ID
 */
export async function exchangeCodeForTokens(code: string) {
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID environment variable');
  }
  
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_URL environment variable');
  }
  
  if (!process.env.SHOPIFY_ORIGIN_URL) {
    throw new Error('Missing SHOPIFY_ORIGIN_URL environment variable');
  }

  const tokenEndpoint = `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL}/auth/oauth/token`;
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        redirect_uri: `${process.env.SHOPIFY_ORIGIN_URL}/authorize`,
        code,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange error:', errorData);
      throw new Error(`Failed to exchange code for tokens: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      customerId: data.customer_id,
    };
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
}

/**
 * Refresh the access token using the refresh token
 * @param refreshToken - The refresh token to use
 * @returns New access token and refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID environment variable');
  }
  
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_URL environment variable');
  }

  const tokenEndpoint = `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL}/auth/oauth/token`;
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token refresh error:', errorData);
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Revoke the access token (logout)
 * @param accessToken - The access token to revoke
 */
export async function revokeAccessToken(accessToken: string) {
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID environment variable');
  }
  
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_API_URL environment variable');
  }

  const revokeEndpoint = `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL}/auth/oauth/revoke`;
  
  try {
    const response = await fetch(revokeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        token: accessToken,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token revocation error:', errorData);
      throw new Error(`Failed to revoke token: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error revoking token:', error);
    throw error;
  }
}

/**
 * Store authentication tokens in HTTP-only cookies
 * @param tokens - Object containing the tokens and customer ID
 */
export const storeAuthTokens = async (tokens: { 
  accessToken: string; 
  refreshToken: string; 
  customerId: string;
}) => {
  const { accessToken, refreshToken, customerId } = tokens;
  
  // Store tokens in HTTP-only cookies
  const cookieStore = await cookies();
  await cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  await cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
  await cookieStore.set(CUSTOMER_ID_COOKIE, customerId, COOKIE_OPTIONS);
};

/**
 * Clear authentication tokens from cookies
 */
export const clearAuthTokens = async () => {
  const cookieStore = await cookies();
  await cookieStore.delete(ACCESS_TOKEN_COOKIE);
  await cookieStore.delete(REFRESH_TOKEN_COOKIE);
  await cookieStore.delete(CUSTOMER_ID_COOKIE);
};

/**
 * Get the access token from cookies
 * @returns The access token or null if not found
 */
export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get(ACCESS_TOKEN_COOKIE);
  return cookie?.value || null;
};

/**
 * Get the refresh token from cookies
 * @returns The refresh token or null if not found
 */
export const getRefreshToken = async () => {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get(REFRESH_TOKEN_COOKIE);
  return cookie?.value || null;
};

/**
 * Get the customer ID from cookies
 * @returns The customer ID or null if not found
 */
export const getCustomerId = async () => {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get(CUSTOMER_ID_COOKIE);
  return cookie?.value || null;
};

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

/**
 * Generate a random state parameter for CSRF protection
 * @returns Random string to use as state parameter
 */
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Redirect to login if not authenticated
 * @param redirectTo - URL to redirect to after login
 */
export function requireAuth(redirectTo?: string) {
  if (!isAuthenticated()) {
    const searchParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const redirectUrl = `/login${searchParams ? `?${searchParams.toString()}` : ''}`;
    redirect(redirectUrl);
  }
}
