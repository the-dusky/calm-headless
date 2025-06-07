import { createStorefrontClient, StorefrontApiResponseOk } from '@shopify/hydrogen-react';

/**
 * Creates a Shopify Storefront API client using environment variables
 * for authentication and configuration.
 */
export const shopifyClient = createStorefrontClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  publicStorefrontToken: process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN || '',
  privateStorefrontToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN || '',
  storefrontApiVersion: '2025-04', // Update this to the latest version as needed
});

/**
 * Executes a GraphQL query against the Shopify Storefront API
 * @param query - GraphQL query string
 * @param variables - Query variables
 * @returns Promise with query results
 */
export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: T }> {
  try {
    // Use the getStorefrontApiUrl and getPrivateTokenHeaders from shopifyClient
    const apiUrl = shopifyClient.getStorefrontApiUrl();
    const headers = shopifyClient.getPrivateTokenHeaders();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(
        `Shopify API error: ${response.status} ${response.statusText}\n${JSON.stringify(result)}`
      );
    }

    return {
      status: response.status,
      body: result,
    };
  } catch (error) {
    console.error('Shopify API error:', error);
    return {
      status: 500,
      body: { error: 'Error fetching data from Shopify' } as unknown as T,
    };
  }
}
