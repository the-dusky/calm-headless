import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify/server-actions';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const after = searchParams.get('after') || undefined;
    const first = parseInt(searchParams.get('first') || '12', 10);
    
    // Fetch products from Shopify
    const { products, pageInfo, error } = await getProducts(first, after);
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    
    return NextResponse.json({ products, pageInfo });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
