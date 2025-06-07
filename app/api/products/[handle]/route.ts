import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify/server-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    
    if (!handle) {
      return NextResponse.json(
        { error: 'Product handle is required' },
        { status: 400 }
      );
    }
    
    // Fetch product from Shopify
    const { product, error } = await getProduct(handle);
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
