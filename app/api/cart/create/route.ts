import { NextRequest, NextResponse } from 'next/server';
import { createCart } from '@/lib/shopify/server-actions';

/**
 * API route to create a new cart
 * POST /api/cart/create
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { lines } = body;
    
    // Create cart using server action
    const result = await createCart(lines);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { cart: result.cart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}
