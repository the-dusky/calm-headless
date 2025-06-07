import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Execute the query using our server-side client
    const response = await shopifyFetch({
      query,
      variables: variables || {}
    });
    
    // Return the response
    return NextResponse.json(response.body);
    
  } catch (error) {
    console.error('GraphQL API error:', error);
    return NextResponse.json(
      { 
        errors: [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }] 
      },
      { status: 500 }
    );
  }
}
