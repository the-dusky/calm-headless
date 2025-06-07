/**
 * TypeScript type definitions for Shopify Storefront API responses
 */

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

export interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart;
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: Cart;
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: Cart;
  };
}

export interface CartResponse {
  cart: Cart;
}
