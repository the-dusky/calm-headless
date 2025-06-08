/**
 * Customer Account API Server Actions
 * 
 * This file contains server actions for interacting with the Shopify Customer Account API.
 */

'use server';

import { redirect } from 'next/navigation';
import { 
  getAuthorizationUrl, 
  exchangeCodeForTokens, 
  storeAuthTokens, 
  clearAuthTokens,
  revokeAccessToken,
  getAccessToken,
  getRefreshToken,
  getCustomerId,
  refreshAccessToken
} from './auth';
import { customerAccountFetch } from './client';
import {
  GET_CUSTOMER,
  GET_CUSTOMER_ADDRESSES,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDER,
  UPDATE_CUSTOMER,
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  SET_DEFAULT_ADDRESS
} from './queries';

/**
 * Initiate the login process by redirecting to Shopify's login page
 * @param redirectTo - URL to redirect to after login
 */
export async function initiateLogin(redirectTo?: string) {
  try {
    // Generate the authorization URL
    const authUrl = getAuthorizationUrl();
    
    // Store the redirect URL in the session if provided
    if (redirectTo) {
      // In a real implementation, you would store this in the session
      // For now, we'll add it as a query parameter to the auth URL
      const url = new URL(authUrl);
      url.searchParams.append('redirect_after_login', redirectTo);
      redirect(url.toString());
    }
    
    // Redirect to the authorization URL
    redirect(authUrl);
  } catch (error) {
    console.error('Error initiating login:', error);
    throw error;
  }
}

/**
 * Handle the OAuth callback from Shopify
 * @param code - Authorization code from Shopify
 * @param redirectTo - URL to redirect to after login
 */
export async function handleAuthCallback(code: string, redirectTo?: string) {
  try {
    // Exchange the code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Store the tokens in cookies
    storeAuthTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      customerId: tokens.customerId
    });
    
    // Redirect to the specified URL or the account page
    redirect(redirectTo || '/account');
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
}

/**
 * Log out the current user
 */
export async function logout() {
  try {
    // Get the access token
    const accessToken = await getAccessToken();
    
    // Revoke the access token if it exists
    if (accessToken) {
      await revokeAccessToken(accessToken);
    }
    
    // Clear the tokens
    await clearAuthTokens();
    
    // Redirect to the home page
    redirect('/');
  } catch (error) {
    console.error('Error logging out:', error);
    
    // Clear the tokens even if revocation fails
    await clearAuthTokens();
    
    // Redirect to the home page
    redirect('/');
  }
}

/**
 * Refresh the access token if needed
 * @returns True if the token was refreshed, false otherwise
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }
    
    return await refreshTokens(refreshToken);
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // If refresh fails, log the user out
    await clearAuthTokens();
    return false;
  }
}

/**
 * Refresh tokens using a refresh token
 * @param refreshToken - The refresh token to use
 * @returns True if successful, false otherwise
 */
export async function refreshTokens(refreshToken: string): Promise<boolean> {
  try {
    // Refresh the token
    const tokens = await refreshAccessToken(refreshToken);
    
    // Store the new tokens
    await storeAuthTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      customerId: await getCustomerId() || 'unchanged' // Use existing customer ID
    });
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
 * Get the current customer's information
 * @returns Customer information
 */
export async function getCustomer() {
  try {
    const { data } = await customerAccountFetch<{ customer: any }>({
      query: GET_CUSTOMER
    });
    
    return data.customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

/**
 * Get the current customer's addresses
 * @returns Customer addresses
 */
export async function getCustomerAddresses() {
  try {
    const { data } = await customerAccountFetch<{ customer: { addresses: any } }>({
      query: GET_CUSTOMER_ADDRESSES
    });
    
    return data.customer.addresses.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error getting customer addresses:', error);
    throw error;
  }
}

/**
 * Get the current customer's orders
 * @param first - Number of orders to fetch
 * @param after - Cursor for pagination
 * @returns Customer orders
 */
export async function getCustomerOrders(first = 10, after?: string) {
  try {
    const { data } = await customerAccountFetch<{ customer: { orders: any } }>({
      query: GET_CUSTOMER_ORDERS,
      variables: { first, after }
    });
    
    return {
      orders: data.customer.orders.edges.map((edge: any) => edge.node),
      pageInfo: data.customer.orders.pageInfo
    };
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
}

/**
 * Get a specific order
 * @param orderId - ID of the order to fetch
 * @returns Order information
 */
export async function getCustomerOrder(orderId: string) {
  try {
    const { data } = await customerAccountFetch<{ customer: { order: any } }>({
      query: GET_CUSTOMER_ORDER,
      variables: { orderId }
    });
    
    return data.customer.order;
  } catch (error) {
    console.error('Error getting customer order:', error);
    throw error;
  }
}

/**
 * Update the customer's profile
 * @param input - Customer update input
 * @returns Updated customer information
 */
export async function updateCustomer(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  try {
    const { data } = await customerAccountFetch<{ customerUpdate: any }>({
      query: UPDATE_CUSTOMER,
      variables: { input }
    });
    
    if (data.customerUpdate.userErrors.length > 0) {
      throw new Error(data.customerUpdate.userErrors[0].message);
    }
    
    return data.customerUpdate.customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

/**
 * Create a new address
 * @param address - Address input
 * @returns Created address
 */
export async function createAddress(address: {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
}) {
  try {
    const { data } = await customerAccountFetch<{ customerAddressCreate: any }>({
      query: CREATE_ADDRESS,
      variables: { address }
    });
    
    if (data.customerAddressCreate.userErrors.length > 0) {
      throw new Error(data.customerAddressCreate.userErrors[0].message);
    }
    
    return data.customerAddressCreate.customerAddress;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
}

/**
 * Update an existing address
 * @param id - ID of the address to update
 * @param address - Updated address input
 * @returns Updated address
 */
export async function updateAddress(id: string, address: {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}) {
  try {
    const { data } = await customerAccountFetch<{ customerAddressUpdate: any }>({
      query: UPDATE_ADDRESS,
      variables: { id, address }
    });
    
    if (data.customerAddressUpdate.userErrors.length > 0) {
      throw new Error(data.customerAddressUpdate.userErrors[0].message);
    }
    
    return data.customerAddressUpdate.customerAddress;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}

/**
 * Delete an address
 * @param id - ID of the address to delete
 * @returns True if successful
 */
export async function deleteAddress(id: string) {
  try {
    const { data } = await customerAccountFetch<{ customerAddressDelete: any }>({
      query: DELETE_ADDRESS,
      variables: { id }
    });
    
    if (data.customerAddressDelete.userErrors.length > 0) {
      throw new Error(data.customerAddressDelete.userErrors[0].message);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

/**
 * Set an address as the default
 * @param addressId - ID of the address to set as default
 * @returns True if successful
 */
export async function setDefaultAddress(addressId: string) {
  try {
    const { data } = await customerAccountFetch<{ customerDefaultAddressUpdate: any }>({
      query: SET_DEFAULT_ADDRESS,
      variables: { addressId }
    });
    
    if (data.customerDefaultAddressUpdate.userErrors.length > 0) {
      throw new Error(data.customerDefaultAddressUpdate.userErrors[0].message);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}
