/**
 * Server-side actions for Shopify Storefront API
 * These functions should only be called from server components or API routes
 */
import { shopifyFetch } from './client';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT_BY_HANDLE, 
  CREATE_CART, 
  ADD_TO_CART, 
  UPDATE_CART, 
  REMOVE_FROM_CART, 
  GET_CART 
} from './queries';
import { 
  Product, 
  ProductsResponse, 
  CartCreateResponse, 
  CartLinesAddResponse, 
  CartLinesUpdateResponse, 
  CartLinesRemoveResponse, 
  CartResponse 
} from './types';

/**
 * Fetch products from Shopify Storefront API
 * @param first Number of products to fetch
 * @param after Cursor for pagination
 * @returns Products and pagination info
 */
export async function getProducts(first: number = 12, after?: string) {
  try {
    console.log('Server: Fetching products with params:', { first, after });
    
    const { body, status } = await shopifyFetch<{ data: ProductsResponse }>({
      query: GET_PRODUCTS,
      variables: { first, after },
    });
    
    console.log('Server: Shopify API response status:', status);
    
    if (body.data?.products) {
      const products = body.data.products.edges.map((edge) => edge.node);
      const pageInfo = body.data.products.pageInfo;
      
      return {
        products,
        pageInfo,
        error: null
      };
    } else {
      console.error('Server: No products data in response');
      return {
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
        error: 'No products found'
      };
    }
  } catch (err) {
    console.error('Server: Error fetching products:', err);
    return {
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Fetch a single product by handle
 * @param handle Product handle
 * @returns Product data
 */
export async function getProduct(handle: string) {
  try {
    const { body } = await shopifyFetch<{ data: { product: Product } }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    });

    if (body.data?.product) {
      return {
        product: body.data.product,
        error: null
      };
    } else {
      return {
        product: null,
        error: 'Product not found'
      };
    }
  } catch (err) {
    return {
      product: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Creates a new cart in Shopify
 * @param lines Optional initial line items
 * @returns Newly created cart or error
 */
export async function createCart(lines?: { merchandiseId: string; quantity: number }[]) {
  try {
    console.log('Server: Creating cart');
    const variables = lines ? { lines } : {};
    
    const { body } = await shopifyFetch<{ data: CartCreateResponse }>({
      query: CREATE_CART,
      variables,
    });

    if (body.data?.cartCreate?.cart) {
      return {
        cart: body.data.cartCreate.cart,
        error: null
      };
    } else {
      // Check for errors in the response
      const errors = body.data?.cartCreate?.userErrors || [];
      const errorMessage = errors.length > 0 
        ? errors.map((err: { message: string }) => err.message).join(', ')
        : 'Failed to create cart';
      
      return {
        cart: null,
        error: errorMessage
      };
    }
  } catch (err: unknown) {
    console.error('Server: Error creating cart:', err);
    return {
      cart: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Adds items to an existing cart
 * @param cartId Cart ID
 * @param lines Line items to add
 * @returns Updated cart or error
 */
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  try {
    console.log('Server: Adding items to cart', { cartId });
    
    const { body } = await shopifyFetch<{ data: CartLinesAddResponse }>({
      query: ADD_TO_CART,
      variables: { cartId, lines },
    });

    if (body.data?.cartLinesAdd?.cart) {
      return {
        cart: body.data.cartLinesAdd.cart,
        error: null
      };
    } else {
      // Check for errors in the response
      const errors = body.data?.cartLinesAdd?.userErrors || [];
      const errorMessage = errors.length > 0 
        ? errors.map((err: { message: string }) => err.message).join(', ')
        : 'Failed to add items to cart';
      
      return {
        cart: null,
        error: errorMessage
      };
    }
  } catch (err: unknown) {
    console.error('Server: Error adding to cart:', err);
    return {
      cart: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Updates items in an existing cart
 * @param cartId Cart ID
 * @param lines Line items to update
 * @returns Updated cart or error
 */
export async function updateCart(cartId: string, lines: { id: string; quantity: number }[]) {
  try {
    console.log('Server: Updating cart items', { cartId });
    
    const { body } = await shopifyFetch<{ data: CartLinesUpdateResponse }>({
      query: UPDATE_CART,
      variables: { cartId, lines },
    });

    if (body.data?.cartLinesUpdate?.cart) {
      return {
        cart: body.data.cartLinesUpdate.cart,
        error: null
      };
    } else {
      // Check for errors in the response
      const errors = body.data?.cartLinesUpdate?.userErrors || [];
      const errorMessage = errors.length > 0 
        ? errors.map((err: { message: string }) => err.message).join(', ')
        : 'Failed to update cart';
      
      return {
        cart: null,
        error: errorMessage
      };
    }
  } catch (err: unknown) {
    console.error('Server: Error updating cart:', err);
    return {
      cart: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Removes items from an existing cart
 * @param cartId Cart ID
 * @param lineIds Line item IDs to remove
 * @returns Updated cart or error
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  try {
    console.log('Server: Removing items from cart', { cartId });
    
    const { body } = await shopifyFetch<{ data: CartLinesRemoveResponse }>({
      query: REMOVE_FROM_CART,
      variables: { cartId, lineIds },
    });

    if (body.data?.cartLinesRemove?.cart) {
      return {
        cart: body.data.cartLinesRemove.cart,
        error: null
      };
    } else {
      // Check for errors in the response
      const errors = body.data?.cartLinesRemove?.userErrors || [];
      const errorMessage = errors.length > 0 
        ? errors.map((err: { message: string }) => err.message).join(', ')
        : 'Failed to remove items from cart';
      
      return {
        cart: null,
        error: errorMessage
      };
    }
  } catch (err: unknown) {
    console.error('Server: Error removing from cart:', err);
    return {
      cart: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}

/**
 * Fetches cart data by ID
 * @param cartId Cart ID
 * @returns Cart data or error
 */
export async function getCart(cartId: string) {
  try {
    console.log('Server: Fetching cart', { cartId });
    
    const { body } = await shopifyFetch<{ data: CartResponse }>({
      query: GET_CART,
      variables: { cartId },
    });

    if (body.data?.cart) {
      return {
        cart: body.data.cart,
        error: null
      };
    } else {
      return {
        cart: null,
        error: 'Cart not found'
      };
    }
  } catch (err: unknown) {
    console.error('Server: Error getting cart:', err);
    return {
      cart: null,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
}
