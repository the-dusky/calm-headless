/**
 * Logout API Route
 * 
 * This route handles user logout by revoking the access token
 * and clearing the authentication cookies.
 */

import { NextResponse } from 'next/server';
import { logout } from '@/lib/shopify/customer-account-api/actions';

export async function GET() {
  try {
    // Log the user out
    // This function will revoke the access token and clear the cookies
    return logout();
  } catch (error) {
    console.error('Error logging out:', error);
    
    // Return an error response
    return NextResponse.json({ error: (error as Error).message || 'Logout failed' }, { status: 500 });
  }
}
