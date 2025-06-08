/**
 * Login API Route
 * 
 * This route initiates the OAuth2 login flow for the Shopify Customer Account API.
 * It redirects the user to Shopify's login page.
 */

import { NextRequest } from 'next/server';
import { initiateLogin } from '@/lib/shopify/customer-account-api/actions';

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get('redirectTo');
    
    // Initiate the login process
    // This function will redirect the user to Shopify's login page
    return initiateLogin(redirectTo || undefined);
  } catch (error) {
    console.error('Error initiating login:', error);
    
    // Return an error response
    return Response.json({ error: (error as Error).message || 'Login failed' }, { status: 500 });
  }
}
