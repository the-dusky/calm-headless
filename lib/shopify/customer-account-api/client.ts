/**
 * Customer Account API Client
 * 
 * This file provides utilities for making GraphQL requests to the Shopify Customer Account API.
 */

import { DocumentNode, print } from 'graphql';
import { getAccessToken } from './auth';

/**
 * Base URL for the Customer Account API GraphQL endpoint
 */
const CUSTOMER_API_BASE_URL = 'https://customer-api.shopify.com/graphql';

/**
 * Make a GraphQL request to the Customer Account API
 * @param query - GraphQL query or mutation
 * @param variables - Variables for the GraphQL operation
 * @returns Response data
 */
export async function customerAccountFetch<T>({
  query,
  variables,
}: {
  query: string | DocumentNode;
  variables?: Record<string, any>;
}): Promise<{ data: T }> {
  // Get the access token from cookies
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available. User must be authenticated.');
  }

  if (!process.env.SHOPIFY_CUSTOMER_API_VERSION) {
    throw new Error('Missing SHOPIFY_CUSTOMER_API_VERSION environment variable');
  }

  // Convert DocumentNode to string if needed
  const queryString = typeof query === 'object' ? print(query) : query;

  try {
    const response = await fetch(CUSTOMER_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Customer-Access-Token': accessToken,
        'X-Shopify-Api-Version': process.env.SHOPIFY_CUSTOMER_API_VERSION,
      },
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Customer API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Customer API GraphQL Error: ${errorMessages}`);
    }

    return result;
  } catch (error) {
    console.error('Customer API request error:', error);
    throw error;
  }
}
