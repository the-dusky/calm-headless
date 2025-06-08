import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, updateCart, removeFromCart } from '@/lib/shopify/server-actions';

/**
 * API route to get cart data
 * GET /api/cart/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id;
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }
    
    // Get cart using server action
    const result = await getCart(cartId);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { cart: result.cart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    );
  }
}

/**
 * API route to add items to cart
 * POST /api/cart/[id]
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id;
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { lines } = body;
    
    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'Lines are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Add to cart using server action
    const result = await addToCart(cartId, lines);
    
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
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

/**
 * API route to update cart items
 * PUT /api/cart/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id;
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { lines } = body;
    
    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'Lines are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Update cart using server action
    const result = await updateCart(cartId, lines);
    
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
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

/**
 * API route to remove items from cart
 * DELETE /api/cart/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id;
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { lineIds } = body;
    
    if (!lineIds || !Array.isArray(lineIds)) {
      return NextResponse.json(
        { error: 'Line IDs are required and must be an array' },
        { status: 400 }
      );
    }
    
    // Remove from cart using server action
    const result = await removeFromCart(cartId, lineIds);
    
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
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
