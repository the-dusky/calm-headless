/**
 * GraphQL queries and mutations for customer authentication and account management
 */
import { gql } from 'graphql-tag';

/**
 * Customer login mutation
 * Creates a customer access token
 */
export const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer registration mutation
 * Creates a new customer account
 */
export const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer access token renewal mutation
 * Renews a customer access token
 */
export const CUSTOMER_ACCESS_TOKEN_RENEW = gql`
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Password reset request mutation
 * Sends a password reset email to the customer
 */
export const CUSTOMER_RECOVER = gql`
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Password reset completion mutation
 * Resets a customer's password using a reset token
 */
export const CUSTOMER_RESET = gql`
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer query
 * Fetches customer information using an access token
 */
export const GET_CUSTOMER = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
    }
  }
`;

/**
 * Customer orders query
 * Fetches a customer's order history
 */
export const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    title
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Customer order query
 * Fetches details of a specific order
 */
export const GET_CUSTOMER_ORDER = gql`
  query getCustomerOrder($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      order(id: $orderId) {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        currentTotalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalShippingPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                title
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Customer update mutation
 * Updates a customer's information
 */
export const CUSTOMER_UPDATE = gql`
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer address create mutation
 * Adds a new address to a customer's address book
 */
export const CUSTOMER_ADDRESS_CREATE = gql`
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer address update mutation
 * Updates an existing address in a customer's address book
 */
export const CUSTOMER_ADDRESS_UPDATE = gql`
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer address delete mutation
 * Removes an address from a customer's address book
 */
export const CUSTOMER_ADDRESS_DELETE = gql`
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Customer default address update mutation
 * Sets an address as the default address for a customer
 */
export const CUSTOMER_DEFAULT_ADDRESS_UPDATE = gql`
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
