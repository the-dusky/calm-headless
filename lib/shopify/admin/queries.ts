import { gql } from 'graphql-tag';

/**
 * Shopify Admin API GraphQL queries and mutations
 */

// Fragments
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    status
    createdAt
    updatedAt
    publishedAt
    onlineStoreUrl
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      position
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          sku
          price
          compareAtPrice
          inventoryQuantity
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    images(first: 20) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

// Shop Information
export const GET_SHOP_INFO = gql`
  query GetShopInfo {
    shop {
      id
      name
      email
      myshopifyDomain
      primaryDomain {
        url
        host
      }
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
      billingAddress {
        address1
        address2
        city
        province
        zip
        country
      }
      currencyCode
    }
  }
`;

// Products Queries
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Inventory Queries
export const GET_INVENTORY_LEVELS = gql`
  query GetInventoryLevels($first: Int!, $after: String) {
    inventoryLevels(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          available
          item {
            id
            variant {
              id
              displayName
              sku
              product {
                id
                title
              }
            }
          }
          location {
            id
            name
            address {
              address1
              address2
              city
              province
              zip
              country
            }
          }
        }
      }
    }
  }
`;

// Orders Queries
export const GET_ORDERS = gql`
  query GetOrders($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          email
          phone
          processedAt
          cancelledAt
          cancelReason
          fullyPaid
          financialStatus
          fulfillmentStatus
          totalPrice {
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
          customer {
            id
            firstName
            lastName
            email
            phone
          }
          shippingAddress {
            address1
            address2
            city
            province
            zip
            country
          }
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                quantity
                originalUnitPrice {
                  amount
                  currencyCode
                }
                variant {
                  id
                  title
                  sku
                  product {
                    id
                    title
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

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        ...ProductFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      product {
        ...ProductFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    productDelete(id: $id) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

// Inventory Mutations
export const UPDATE_INVENTORY_LEVEL = gql`
  mutation UpdateInventoryLevel($inventoryLevelId: ID!, $available: Int!) {
    inventoryLevelUpdate(input: {
      id: $inventoryLevelId,
      available: $available
    }) {
      inventoryLevel {
        id
        available
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Order Mutations
export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $input: OrderInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        id
        name
        fulfillmentStatus
        financialStatus
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!, $reason: OrderCancelReason!) {
    orderCancel(id: $id, reason: $reason) {
      order {
        id
        name
        cancelledAt
        cancelReason
      }
      userErrors {
        field
        message
      }
    }
  }
`;
