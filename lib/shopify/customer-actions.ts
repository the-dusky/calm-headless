/**
 * Server actions for customer authentication and account management
 */
import { print } from 'graphql';
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_CREATE,
  CUSTOMER_ACCESS_TOKEN_RENEW,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET,
  GET_CUSTOMER,
  GET_CUSTOMER_ORDERS,
  GET_CUSTOMER_ORDER,
  CUSTOMER_UPDATE,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE
} from './customer-queries';
import { shopifyFetch } from './client';
import {
  CustomerAccessTokenCreateResponse,
  CustomerCreateResponse,
  CustomerAccessTokenRenewResponse,
  CustomerRecoverResponse,
  CustomerResetResponse,
  CustomerResponse,
  CustomerUpdateResponse,
  CustomerAddressCreateResponse,
  CustomerAddressUpdateResponse,
  CustomerAddressDeleteResponse,
  CustomerDefaultAddressUpdateResponse,
  CustomerUserError
} from './types';

/**
 * Handles customer authentication errors
 * @param errors - Array of customer user errors
 * @returns Formatted error message
 */
function handleCustomerErrors(errors: CustomerUserError[]): string {
  if (!errors || errors.length === 0) {
    return 'An unknown error occurred';
  }
  
  return errors.map(error => error.message).join(', ');
}

/**
 * Login a customer with email and password
 * @param email - Customer email
 * @param password - Customer password
 * @returns Access token or error
 */
export async function loginCustomer(email: string, password: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerAccessTokenCreateResponse }>({
      query: print(CUSTOMER_ACCESS_TOKEN_CREATE),
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    const { customerAccessTokenCreate } = body.data;
    
    if (customerAccessTokenCreate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerAccessTokenCreate.customerUserErrors),
      };
    }
    
    if (!customerAccessTokenCreate.customerAccessToken) {
      return {
        error: 'Failed to create access token',
      };
    }
    
    return {
      accessToken: customerAccessTokenCreate.customerAccessToken.accessToken,
      expiresAt: customerAccessTokenCreate.customerAccessToken.expiresAt,
    };
  } catch (err: unknown) {
    console.error('Error logging in customer:', err);
    return {
      error: 'An error occurred while logging in. Please try again.',
    };
  }
}

/**
 * Register a new customer
 * @param email - Customer email
 * @param password - Customer password
 * @param firstName - Customer first name (optional)
 * @param lastName - Customer last name (optional)
 * @returns Success status or error
 */
export async function registerCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerCreateResponse }>({
      query: print(CUSTOMER_CREATE),
      variables: {
        input: {
          email,
          password,
          firstName,
          lastName,
          acceptsMarketing: false,
        },
      },
    });

    const { customerCreate } = body.data;
    
    if (customerCreate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerCreate.customerUserErrors),
      };
    }
    
    if (!customerCreate.customer) {
      return {
        error: 'Failed to create customer',
      };
    }
    
    // After registration, log the customer in
    const loginResult = await loginCustomer(email, password);
    
    if (loginResult.error) {
      return {
        success: true,
        message: 'Account created successfully. Please log in.',
      };
    }
    
    return {
      success: true,
      accessToken: loginResult.accessToken,
      expiresAt: loginResult.expiresAt,
    };
  } catch (err: unknown) {
    console.error('Error registering customer:', err);
    return {
      error: 'An error occurred while registering. Please try again.',
    };
  }
}

/**
 * Renew a customer access token
 * @param customerAccessToken - Current access token
 * @returns New access token or error
 */
export async function renewCustomerAccessToken(customerAccessToken: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerAccessTokenRenewResponse }>({
      query: print(CUSTOMER_ACCESS_TOKEN_RENEW),
      variables: {
        customerAccessToken,
      },
    });

    const { customerAccessTokenRenew } = body.data;
    
    if (customerAccessTokenRenew.userErrors.length > 0) {
      return {
        error: customerAccessTokenRenew.userErrors.map(error => error.message).join(', '),
      };
    }
    
    if (!customerAccessTokenRenew.customerAccessToken) {
      return {
        error: 'Failed to renew access token',
      };
    }
    
    return {
      accessToken: customerAccessTokenRenew.customerAccessToken.accessToken,
      expiresAt: customerAccessTokenRenew.customerAccessToken.expiresAt,
    };
  } catch (err: unknown) {
    console.error('Error renewing customer access token:', err);
    return {
      error: 'An error occurred while renewing your session. Please log in again.',
    };
  }
}

/**
 * Request a password reset for a customer
 * @param email - Customer email
 * @returns Success status or error
 */
export async function requestPasswordReset(email: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerRecoverResponse }>({
      query: print(CUSTOMER_RECOVER),
      variables: {
        email,
      },
    });

    const { customerRecover } = body.data;
    
    if (customerRecover.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerRecover.customerUserErrors),
      };
    }
    
    return {
      success: true,
      message: 'If an account with that email exists, you will receive a password reset email shortly.',
    };
  } catch (err: unknown) {
    console.error('Error requesting password reset:', err);
    return {
      // Return success even on error to prevent email enumeration
      success: true,
      message: 'If an account with that email exists, you will receive a password reset email shortly.',
    };
  }
}

/**
 * Reset a customer's password using a reset token
 * @param id - Customer ID
 * @param resetToken - Password reset token
 * @param password - New password
 * @returns Success status or error
 */
export async function resetPassword(id: string, resetToken: string, password: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerResetResponse }>({
      query: print(CUSTOMER_RESET),
      variables: {
        id,
        input: {
          resetToken,
          password,
        },
      },
    });

    const { customerReset } = body.data;
    
    if (customerReset.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerReset.customerUserErrors),
      };
    }
    
    if (!customerReset.customerAccessToken) {
      return {
        error: 'Password reset was successful, but we could not log you in. Please log in with your new password.',
      };
    }
    
    return {
      success: true,
      message: 'Your password has been reset successfully.',
      accessToken: customerReset.customerAccessToken.accessToken,
      expiresAt: customerReset.customerAccessToken.expiresAt,
    };
  } catch (err: unknown) {
    console.error('Error resetting password:', err);
    return {
      error: 'An error occurred while resetting your password. Please try again.',
    };
  }
}

/**
 * Get customer data using an access token
 * @param customerAccessToken - Customer access token
 * @returns Customer data or error
 */
export async function getCustomerData(customerAccessToken: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerResponse }>({
      query: print(GET_CUSTOMER),
      variables: {
        customerAccessToken,
      },
    });

    const { customer } = body.data;
    
    if (!customer) {
      return {
        error: 'Customer not found',
      };
    }
    
    return {
      customer,
    };
  } catch (err: unknown) {
    console.error('Error fetching customer data:', err);
    return {
      error: 'An error occurred while fetching your account information.',
    };
  }
}

/**
 * Get customer orders
 * @param customerAccessToken - Customer access token
 * @param first - Number of orders to fetch
 * @param after - Cursor for pagination
 * @returns Customer orders or error
 */
export async function getCustomerOrders(customerAccessToken: string, first = 10, after?: string) {
  try {
    const { body } = await shopifyFetch<{ data: { customer: { orders: any } } }>({
      query: print(GET_CUSTOMER_ORDERS),
      variables: {
        customerAccessToken,
        first,
        after,
      },
    });

    const { customer } = body.data;
    
    if (!customer || !customer.orders) {
      return {
        error: 'Orders not found',
      };
    }
    
    return {
      orders: customer.orders,
    };
  } catch (err: unknown) {
    console.error('Error fetching customer orders:', err);
    return {
      error: 'An error occurred while fetching your orders.',
    };
  }
}

/**
 * Get a specific customer order
 * @param customerAccessToken - Customer access token
 * @param orderId - Order ID
 * @returns Order details or error
 */
export async function getCustomerOrder(customerAccessToken: string, orderId: string) {
  try {
    const { body } = await shopifyFetch<{ data: { customer: { order: any } } }>({
      query: print(GET_CUSTOMER_ORDER),
      variables: {
        customerAccessToken,
        orderId,
      },
    });

    const { customer } = body.data;
    
    if (!customer || !customer.order) {
      return {
        error: 'Order not found',
      };
    }
    
    return {
      order: customer.order,
    };
  } catch (err: unknown) {
    console.error('Error fetching customer order:', err);
    return {
      error: 'An error occurred while fetching your order details.',
    };
  }
}

/**
 * Update customer profile information
 * @param customerAccessToken - Customer access token
 * @param customer - Customer update input
 * @returns Updated customer data or error
 */
export async function updateCustomerProfile(
  customerAccessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }
) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerUpdateResponse }>({
      query: print(CUSTOMER_UPDATE),
      variables: {
        customerAccessToken,
        customer,
      },
    });

    const { customerUpdate } = body.data;
    
    if (customerUpdate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerUpdate.customerUserErrors),
      };
    }
    
    if (!customerUpdate.customer) {
      return {
        error: 'Failed to update profile',
      };
    }
    
    // If the customer changed their password, return the new token
    if (customer.password && customerUpdate.customerAccessToken) {
      return {
        customer: customerUpdate.customer,
        accessToken: customerUpdate.customerAccessToken.accessToken,
        expiresAt: customerUpdate.customerAccessToken.expiresAt,
      };
    }
    
    return {
      customer: customerUpdate.customer,
    };
  } catch (err: unknown) {
    console.error('Error updating customer profile:', err);
    return {
      error: 'An error occurred while updating your profile. Please try again.',
    };
  }
}

/**
 * Create a new address for a customer
 * @param customerAccessToken - Customer access token
 * @param address - Address input
 * @returns Created address or error
 */
export async function createCustomerAddress(
  customerAccessToken: string,
  address: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    country: string;
    zip: string;
    phone?: string;
  }
) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerAddressCreateResponse }>({
      query: print(CUSTOMER_ADDRESS_CREATE),
      variables: {
        customerAccessToken,
        address,
      },
    });

    const { customerAddressCreate } = body.data;
    
    if (customerAddressCreate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerAddressCreate.customerUserErrors),
      };
    }
    
    if (!customerAddressCreate.customerAddress) {
      return {
        error: 'Failed to create address',
      };
    }
    
    return {
      address: customerAddressCreate.customerAddress,
    };
  } catch (err: unknown) {
    console.error('Error creating customer address:', err);
    return {
      error: 'An error occurred while creating your address. Please try again.',
    };
  }
}

/**
 * Update an existing customer address
 * @param customerAccessToken - Customer access token
 * @param addressId - Address ID
 * @param address - Address update input
 * @returns Updated address or error
 */
export async function updateCustomerAddress(
  customerAccessToken: string,
  addressId: string,
  address: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  }
) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerAddressUpdateResponse }>({
      query: print(CUSTOMER_ADDRESS_UPDATE),
      variables: {
        customerAccessToken,
        id: addressId,
        address,
      },
    });

    const { customerAddressUpdate } = body.data;
    
    if (customerAddressUpdate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerAddressUpdate.customerUserErrors),
      };
    }
    
    if (!customerAddressUpdate.customerAddress) {
      return {
        error: 'Failed to update address',
      };
    }
    
    return {
      address: customerAddressUpdate.customerAddress,
    };
  } catch (err: unknown) {
    console.error('Error updating customer address:', err);
    return {
      error: 'An error occurred while updating your address. Please try again.',
    };
  }
}

/**
 * Delete a customer address
 * @param customerAccessToken - Customer access token
 * @param addressId - Address ID
 * @returns Success status or error
 */
export async function deleteCustomerAddress(customerAccessToken: string, addressId: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerAddressDeleteResponse }>({
      query: print(CUSTOMER_ADDRESS_DELETE),
      variables: {
        customerAccessToken,
        id: addressId,
      },
    });

    const { customerAddressDelete } = body.data;
    
    if (customerAddressDelete.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerAddressDelete.customerUserErrors),
      };
    }
    
    if (!customerAddressDelete.deletedCustomerAddressId) {
      return {
        error: 'Failed to delete address',
      };
    }
    
    return {
      success: true,
      deletedAddressId: customerAddressDelete.deletedCustomerAddressId,
    };
  } catch (err: unknown) {
    console.error('Error deleting customer address:', err);
    return {
      error: 'An error occurred while deleting your address. Please try again.',
    };
  }
}

/**
 * Set a customer address as the default address
 * @param customerAccessToken - Customer access token
 * @param addressId - Address ID
 * @returns Success status or error
 */
export async function setDefaultCustomerAddress(customerAccessToken: string, addressId: string) {
  try {
    const { body } = await shopifyFetch<{ data: CustomerDefaultAddressUpdateResponse }>({
      query: print(CUSTOMER_DEFAULT_ADDRESS_UPDATE),
      variables: {
        customerAccessToken,
        addressId,
      },
    });

    const { customerDefaultAddressUpdate } = body.data;
    
    if (customerDefaultAddressUpdate.customerUserErrors.length > 0) {
      return {
        error: handleCustomerErrors(customerDefaultAddressUpdate.customerUserErrors),
      };
    }
    
    if (!customerDefaultAddressUpdate.customer) {
      return {
        error: 'Failed to set default address',
      };
    }
    
    return {
      success: true,
      customer: customerDefaultAddressUpdate.customer,
    };
  } catch (err: unknown) {
    console.error('Error setting default customer address:', err);
    return {
      error: 'An error occurred while setting your default address. Please try again.',
    };
  }
}
