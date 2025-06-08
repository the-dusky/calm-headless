/**
 * Customer Account API GraphQL Queries and Mutations
 * 
 * This file contains GraphQL queries and mutations for interacting with the Shopify Customer Account API.
 */

import { gql } from 'graphql-tag';

/**
 * Query to get the current customer's information
 */
export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      createdAt
      updatedAt
      displayName
      emailAddress {
        email
        emailType
        marketingState
      }
    }
  }
`;

/**
 * Query to get the current customer's addresses
 */
export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses {
    customer {
      id
      addresses {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            city
            province
            zip
            country
            phone
            isDefaultShippingAddress
            isDefaultBillingAddress
          }
        }
      }
    }
  }
`;

/**
 * Query to get the current customer's orders
 */
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($first: Int!, $after: String) {
    customer {
      id
      orders(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
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
 * Query to get a specific order
 */
export const GET_CUSTOMER_ORDER = gql`
  query GetCustomerOrder($orderId: ID!) {
    customer {
      id
      order(id: $orderId) {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        currentTotalPrice {
          amount
          currencyCode
        }
        shippingAddress {
          id
          formatted
          firstName
          lastName
          company
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                id
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
 * Mutation to update the customer's profile
 */
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to create a new address
 */
export const CREATE_ADDRESS = gql`
  mutation CreateAddress($address: MailingAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
        formatted
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to update an existing address
 */
export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(id: $id, address: $address) {
      customerAddress {
        id
        formatted
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to delete an address
 */
export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    customerAddressDelete(id: $id) {
      deletedCustomerAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Mutation to set default address
 */
export const SET_DEFAULT_ADDRESS = gql`
  mutation SetDefaultAddress($addressId: ID!) {
    customerDefaultAddressUpdate(addressId: $addressId) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
