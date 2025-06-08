/**
 * Customer API Route
 * 
 * This route retrieves the current customer's information
 * for use in the authentication context.
 */

import { NextResponse } from 'next/server';
import { isAuthenticated, getRefreshToken } from '@/lib/shopify/customer-account-api/auth';
import { getCustomer, refreshTokens } from '@/lib/shopify/customer-account-api/actions';

export async function GET() {
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Try to refresh the token if available
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await refreshTokens(refreshToken);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Continue with the current token if refresh fails
      }
    }
    
    // Get the customer data
    const customer = await getCustomer();
    
    // Return the customer data
    return Response.json({ customer });
  } catch (error) {
    console.error('Error getting customer data:', error);
    
    // Return an error response
    return Response.json({ error: (error as Error).message || 'Failed to get customer data' }, { status: 500 });
  }
}
