/**
 * OAuth Callback Handler
 * 
 * This route handles the OAuth callback from Shopify's Customer Account API.
 * It exchanges the authorization code for access and refresh tokens,
 * stores them securely in HTTP-only cookies, and redirects the user.
 */

import { NextRequest } from 'next/server';
import { handleAuthCallback } from '@/lib/shopify/customer-account-api/actions';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const redirectAfterLogin = searchParams.get('redirect_after_login');
    
    if (!code) {
      return Response.json({ error: 'Missing authorization code' }, { status: 400 });
    }
    
    // Handle the authorization callback
    // This function will exchange the code for tokens, store them in cookies,
    // and redirect the user to the appropriate page
    return handleAuthCallback(code, redirectAfterLogin || undefined);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    
    // Redirect to login page with error
    const errorMessage = encodeURIComponent((error as Error).message || 'Authentication failed');
    return Response.redirect(`${process.env.SHOPIFY_ORIGIN_URL}/login?error=${errorMessage}`);
  }
}
