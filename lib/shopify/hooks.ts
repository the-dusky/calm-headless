import { useState, useEffect } from 'react';
import { shopifyFetch } from './client';
import {
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCTS,
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTIONS,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART,
  REMOVE_FROM_CART,
  GET_CART,
} from './queries';
import {
  Product,
  ProductResponse,
  ProductsResponse,
  Collection,
  CollectionResponse,
  CollectionsResponse,
  Cart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartResponse,
} from './types';

/**
 * Hook to fetch a product by its handle
 */
export function useProduct(handle: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { body } = await shopifyFetch<{ data: ProductResponse }>({
          query: GET_PRODUCT_BY_HANDLE,
          variables: { handle },
        });

        if (body.data?.product) {
          setProduct(body.data.product);
        } else {
          setError(new Error('Product not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  return { product, loading, error };
}

/**
 * Hook to fetch multiple products
 */
export function useProducts(first: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean; endCursor: string | null }>({
    hasNextPage: false,
    endCursor: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async (after?: string) => {
    try {
      setLoading(true);
      console.log('Fetching products with params:', { first, after });
      
      const { body, status } = await shopifyFetch<{ data: ProductsResponse }>({
        query: GET_PRODUCTS,
        variables: { first, after },
      });
      
      console.log('Shopify API response status:', status);
      console.log('Shopify API response body:', body);

      if (body.data?.products) {
        const newProducts = body.data.products.edges.map((edge) => edge.node);
        console.log('Parsed products:', newProducts.length, newProducts);
        setProducts(after ? [...products, ...newProducts] : newProducts);
        setPageInfo(body.data.products.pageInfo);
      } else {
        console.error('No products data in response:', body);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [first]);

  const loadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchProducts(pageInfo.endCursor);
    }
  };

  return { products, loading, error, loadMore, hasNextPage: pageInfo.hasNextPage };
}

/**
 * Hook to fetch products by collection
 */
export function useCollectionProducts(handle: string, first: number = 10) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean; endCursor: string | null }>({
    hasNextPage: false,
    endCursor: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollectionProducts = async (after?: string) => {
    try {
      setLoading(true);
      const { body } = await shopifyFetch<{ data: CollectionResponse }>({
        query: GET_COLLECTION_PRODUCTS,
        variables: { handle, first, after },
      });

      if (body.data?.collection) {
        setCollection(body.data.collection);
        const newProducts = body.data.collection.products?.edges.map((edge) => edge.node) || [];
        setProducts(after ? [...products, ...newProducts] : newProducts);
        setPageInfo(body.data.collection.products?.pageInfo || { hasNextPage: false, endCursor: null });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (handle) {
      fetchCollectionProducts();
    }
  }, [handle, first]);

  const loadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchCollectionProducts(pageInfo.endCursor);
    }
  };

  return {
    collection,
    products,
    loading,
    error,
    loadMore,
    hasNextPage: pageInfo.hasNextPage,
  };
}

/**
 * Hook to fetch all collections
 */
export function useCollections(first: number = 10) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const { body } = await shopifyFetch<{ data: CollectionsResponse }>({
          query: GET_COLLECTIONS,
          variables: { first },
        });

        if (body.data?.collections) {
          setCollections(body.data.collections.edges.map((edge) => edge.node));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [first]);

  return { collections, loading, error };
}

// Cart functions
const CART_ID_KEY = 'shopify_cart_id';

/**
 * Get the cart ID from local storage
 */
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

/**
 * Save the cart ID to local storage
 */
export function saveCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, cartId);
}

/**
 * Create a new cart
 */
export async function createCart(lines?: { merchandiseId: string; quantity: number }[]) {
  try {
    const variables = lines ? { lines } : {};
    const { body } = await shopifyFetch<{ data: CartCreateResponse }>({
      query: CREATE_CART,
      variables,
    });

    if (body.data?.cartCreate?.cart) {
      const cart = body.data.cartCreate.cart;
      saveCartId(cart.id);
      return cart;
    }
    throw new Error('Failed to create cart');
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Add items to cart
 */
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  try {
    const { body } = await shopifyFetch<{ data: CartLinesAddResponse }>({
      query: ADD_TO_CART,
      variables: { cartId, lines },
    });

    if (body.data?.cartLinesAdd?.cart) {
      return body.data.cartLinesAdd.cart;
    }
    throw new Error('Failed to add to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart items
 */
export async function updateCart(cartId: string, lines: { id: string; quantity: number }[]) {
  try {
    const { body } = await shopifyFetch<{ data: CartLinesUpdateResponse }>({
      query: UPDATE_CART,
      variables: { cartId, lines },
    });

    if (body.data?.cartLinesUpdate?.cart) {
      return body.data.cartLinesUpdate.cart;
    }
    throw new Error('Failed to update cart');
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

/**
 * Remove items from cart
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  try {
    const { body } = await shopifyFetch<{ data: CartLinesRemoveResponse }>({
      query: REMOVE_FROM_CART,
      variables: { cartId, lineIds },
    });

    if (body.data?.cartLinesRemove?.cart) {
      return body.data.cartLinesRemove.cart;
    }
    throw new Error('Failed to remove from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string) {
  try {
    const { body } = await shopifyFetch<{ data: CartResponse }>({
      query: GET_CART,
      variables: { cartId },
    });

    if (body.data?.cart) {
      return body.data.cart;
    }
    return null;
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
}

/**
 * Hook to manage cart state
 */
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartId = getCartId();
      
      if (cartId) {
        const cartData = await getCart(cartId);
        setCart(cartData);
      } else {
        setCart(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (merchandiseId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      let cartId = getCartId();
      
      if (!cartId) {
        const newCart = await createCart([{ merchandiseId, quantity }]);
        setCart(newCart);
        return;
      }
      
      const updatedCart = await addToCart(cartId, [{ merchandiseId, quantity }]);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    try {
      setLoading(true);
      const cartId = getCartId();
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const updatedCart = await updateCart(cartId, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    try {
      setLoading(true);
      const cartId = getCartId();
      
      if (!cartId) {
        throw new Error('No cart found');
      }
      
      const updatedCart = await removeFromCart(cartId, [lineId]);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    refreshCart: fetchCart,
  };
}
