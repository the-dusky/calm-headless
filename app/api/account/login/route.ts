/**
 * API route for customer login
 */
import { NextRequest, NextResponse } from 'next/server';
import { loginCustomer } from '@/lib/shopify/customer-actions';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Call the server action to login the customer
    const result = await loginCustomer(email, password);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
    
    // Return the access token and expiry
    return NextResponse.json({
      accessToken: result.accessToken,
      expiresAt: result.expiresAt
    });
    
  } catch (err) {
    console.error('Error in login API route:', err);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
