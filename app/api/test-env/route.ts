import { NextResponse } from 'next/server';

export async function GET() {
  // Only show partial tokens for security
  const maskToken = (token: string | undefined) => {
    if (!token) return 'Not set';
    if (token.length <= 8) return '********';
    return token.substring(0, 4) + '...' + token.substring(token.length - 4);
  };

  // Check environment variables directly
  const storeDomain = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontPublicToken = !!process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN;
  const storefrontPrivateToken = !!process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN;
  const adminApiToken = !!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  
  // Only consider required variables for validity
  const isValid = storeDomain && storefrontPublicToken && storefrontPrivateToken;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    shopify: {
      storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'Not set',
      storefrontPublicToken: maskToken(process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN),
      storefrontPrivateToken: maskToken(process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN),
      // Admin API token is optional and not used in this application
      adminApiToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ? 
        maskToken(process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) : 
        'Not set (optional)',
    },
    status: {
      // isValid only checks required variables now
      isValid,
      storeDomain,
      storefrontPublicToken,
      storefrontPrivateToken,
      // Admin API token is optional
      adminApiToken,
      missingVars: [
        ...(!storeDomain ? ['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN'] : []),
        ...(!storefrontPublicToken ? ['SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN'] : []),
        ...(!storefrontPrivateToken ? ['SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN'] : [])
      ]
    }
  });
}
