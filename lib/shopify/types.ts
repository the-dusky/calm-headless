/**
 * TypeScript type definitions for Shopify Storefront API responses
 */

// ===== Product and Collection Types =====

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  product?: Product;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: {
    edges: Array<{
      node: Image;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: Image | null;
  products?: {
    pageInfo: PageInfo;
    edges: Array<{
      node: Product;
    }>;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: Image;
        }>;
      };
    };
    price: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money;
  };
}

// Response types for GraphQL queries
export interface ProductResponse {
  product: Product;
}

export interface ProductsResponse {
  products: {
    pageInfo: PageInfo;
    edges: Array<{
      node: Product;
    }>;
  };
}

export interface CollectionResponse {
  collection: Collection;
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{
      node: Collection;
    }>;
  };
}

export interface UserError {
  code?: string;
  field?: string[];
  message: string;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
    userErrors: UserError[];
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart;
    userErrors: UserError[];
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: Cart;
    userErrors: UserError[];
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart;
    userErrors: UserError[];
  };
}

export interface CartResponse {
  cart: Cart;
}

// ===== Customer Types =====

export interface CustomerAddress {
  id: string;
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

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  defaultAddress?: CustomerAddress;
  addresses: {
    edges: Array<{
      node: CustomerAddress;
    }>;
  };
  orders?: {
    pageInfo: PageInfo;
    edges: Array<{
      node: CustomerOrder;
    }>;
  };
}

export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  currentTotalPrice: Money;
  subtotalPrice?: Money;
  totalShippingPrice?: Money;
  totalTax?: Money;
  shippingAddress?: CustomerAddress;
  lineItems: {
    edges: Array<{
      node: CustomerOrderLineItem;
    }>;
  };
}

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
  originalTotalPrice: Money;
  variant?: {
    title: string;
    image?: {
      url: string;
      altText?: string;
    };
  };
}

export interface CustomerUserError {
  code?: string;
  field?: string[];
  message: string;
}

// ===== Authentication Response Types =====

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerCreateResponse {
  customerCreate: {
    customer?: Customer;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerAccessTokenRenewResponse {
  customerAccessTokenRenew: {
    customerAccessToken?: CustomerAccessToken;
    userErrors: UserError[];
  };
}

export interface CustomerRecoverResponse {
  customerRecover: {
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerResetResponse {
  customerReset: {
    customer?: Customer;
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerResponse {
  customer: Customer;
}

export interface CustomerUpdateResponse {
  customerUpdate: {
    customer?: Customer;
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: CustomerUserError[];
  };
}

// ===== Address Management Response Types =====

export interface CustomerAddressCreateResponse {
  customerAddressCreate: {
    customerAddress?: CustomerAddress;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerAddressUpdateResponse {
  customerAddressUpdate: {
    customerAddress?: CustomerAddress;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerAddressDeleteResponse {
  customerAddressDelete: {
    deletedCustomerAddressId?: string;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerDefaultAddressUpdateResponse {
  customerDefaultAddressUpdate: {
    customer?: {
      id: string;
      defaultAddress?: {
        id: string;
      };
    };
    customerUserErrors: CustomerUserError[];
  };
}
