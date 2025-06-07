/**
 * Shopify Admin API client utility
 * 
 * This module provides functions to interact with the Shopify Admin API
 * for managing products, inventory, orders, and store settings.
 */

// Environment variables
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '';
const SHOPIFY_ADMIN_API_VERSION = '2023-10'; // Update this to the latest stable version

// Admin API endpoint
const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;

/**
 * Fetch data from Shopify Admin API using GraphQL
 * 
 * @param query - GraphQL query or mutation string
 * @param variables - Variables for the GraphQL operation
 * @returns Promise with the API response
 */
export async function shopifyAdminFetch<T>({
  query,
  variables = {}
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ status: number; body: T }> {
  try {
    if (!SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
      throw new Error('Missing SHOPIFY_ADMIN_API_ACCESS_TOKEN. Please check your .env.local file.');
    }

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const body = await response.json();

    if (body.errors) {
      throw new Error(
        `Shopify Admin API Error: ${body.errors.map((e: any) => e.message).join(', ')}`
      );
    }

    return {
      status: response.status,
      body
    };
  } catch (error) {
    console.error('Error fetching from Shopify Admin API:', error);
    throw error;
  }
}

/**
 * Check if the Admin API is properly configured and accessible
 * 
 * @returns Promise with boolean indicating if the API is accessible
 */
export async function checkAdminApiAccess(): Promise<boolean> {
  try {
    // Simple query to check if we can access the Admin API
    const query = `
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
      }
    `;

    const response = await shopifyAdminFetch({ query });
    return response.status === 200 && !!response.body;
  } catch (error) {
    console.error('Admin API access check failed:', error);
    return false;
  }
}
