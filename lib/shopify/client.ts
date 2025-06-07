import { createStorefrontClient, StorefrontApiResponseOk } from '@shopify/hydrogen-react';
import { DocumentNode, print } from 'graphql';

// Check environment variables and log status (without exposing actual tokens)
if (typeof window === 'undefined') { // Only log on server side
  const storeDomain = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontPublicToken = !!process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN;
  const storefrontPrivateToken = !!process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN;
  const adminApiToken = !!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  
  console.log('Shopify Storefront API Configuration:');
  console.log(`- Store Domain: ${storeDomain ? '✓ Set' : '✗ Missing'}`);
  console.log(`- Public Token: ${storefrontPublicToken ? '✓ Set' : '✗ Missing'}`);
  console.log(`- Private Token: ${storefrontPrivateToken ? '✓ Set' : '✗ Missing'}`);
  
  const missingVars = [];
  if (!storeDomain) missingVars.push('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
  if (!storefrontPublicToken) missingVars.push('SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN');
  if (!storefrontPrivateToken) missingVars.push('SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN');
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Please check your .env.local file and ensure all required variables are set.');
  }
}

/**
 * Creates a Shopify Storefront API client using environment variables
 * for authentication and configuration.
 */
export const shopifyClient = createStorefrontClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  publicStorefrontToken: process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN || '',
  privateStorefrontToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN || '',
  storefrontApiVersion: '2023-10', // Using a stable version
});

/**
 * Executes a GraphQL query against the Shopify Storefront API
 * @param query - GraphQL query string or DocumentNode
 * @param variables - Query variables
 * @returns Promise with query results
 */
export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string | DocumentNode;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: T }> {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
      throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
    }
    
    if (!process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN) {
      throw new Error('Missing SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN environment variable');
    }
    
    // Use the getStorefrontApiUrl and getPrivateTokenHeaders from shopifyClient
    const apiUrl = shopifyClient.getStorefrontApiUrl();
    const headers = shopifyClient.getPrivateTokenHeaders();
    
    // Convert DocumentNode to string if needed
    const queryString = typeof query === 'object' ? print(query) : query;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(
        `Shopify API error: ${response.status} ${response.statusText}\n${JSON.stringify(result)}`
      );
    }
    
    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Shopify GraphQL Error: ${errorMessages}`);
    }

    return {
      status: response.status,
      body: result,
    };
  } catch (error) {
    console.error('Shopify API error:', error);
    return {
      status: 500,
      body: { errors: [{ message: error instanceof Error ? error.message : 'Error fetching data from Shopify' }] } as unknown as T,
    };
  }
}
