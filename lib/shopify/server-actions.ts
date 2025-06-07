/**
 * Server-side actions for Shopify Storefront API
 * These functions should only be called from server components or API routes
 */
import { shopifyFetch } from './client';
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE } from './queries';
import { Product, ProductsResponse } from './types';

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
