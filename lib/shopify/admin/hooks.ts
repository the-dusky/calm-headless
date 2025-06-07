import { useState, useEffect, useCallback } from 'react';
import { shopifyAdminFetch } from './client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_HANDLE,
  GET_INVENTORY_LEVELS,
  GET_ORDERS,
  GET_SHOP_INFO,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_INVENTORY_LEVEL,
  UPDATE_ORDER,
  CANCEL_ORDER
} from './queries';
import { DocumentNode } from 'graphql';

// Helper type for pagination
type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

/**
 * Hook for fetching shop information
 */
export function useShopInfo() {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShopInfo() {
      try {
        setLoading(true);
        const response = await shopifyAdminFetch({
          query: GET_SHOP_INFO.loc?.source.body || ''
        });
        
        if (response.body?.data?.shop) {
          setShop(response.body.data.shop);
        } else {
          throw new Error('Failed to fetch shop information');
        }
      } catch (err) {
        console.error('Error fetching shop info:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchShopInfo();
  }, []);

  return { shop, loading, error };
}

/**
 * Hook for fetching and managing products
 */
export function useAdminProducts(initialPageSize = 20) {
  const [products, setProducts] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async (cursor: string | null = null, pageSize = initialPageSize) => {
    try {
      setLoading(true);
      const response = await shopifyAdminFetch({
        query: GET_PRODUCTS.loc?.source.body || '',
        variables: {
          first: pageSize,
          after: cursor
        }
      });

      if (response.body?.data?.products) {
        const { edges, pageInfo: newPageInfo } = response.body.data.products;
        const newProducts = edges.map((edge: any) => edge.node);
        
        setProducts(prevProducts => cursor ? [...prevProducts, ...newProducts] : newProducts);
        setPageInfo(newPageInfo);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [initialPageSize]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      await fetchProducts(pageInfo.endCursor);
    }
  }, [fetchProducts, pageInfo]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(async (productInput: any) => {
    try {
      const response = await shopifyAdminFetch({
        query: CREATE_PRODUCT.loc?.source.body || '',
        variables: {
          input: productInput
        }
      });

      if (response.body?.data?.productCreate?.userErrors?.length > 0) {
        throw new Error(response.body.data.productCreate.userErrors[0].message);
      }

      // Refresh products after creation
      fetchProducts();
      return response.body?.data?.productCreate?.product;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, productInput: any) => {
    try {
      const response = await shopifyAdminFetch({
        query: UPDATE_PRODUCT.loc?.source.body || '',
        variables: {
          id,
          input: productInput
        }
      });

      if (response.body?.data?.productUpdate?.userErrors?.length > 0) {
        throw new Error(response.body.data.productUpdate.userErrors[0].message);
      }

      // Refresh products after update
      fetchProducts();
      return response.body?.data?.productUpdate?.product;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await shopifyAdminFetch({
        query: DELETE_PRODUCT.loc?.source.body || '',
        variables: { id }
      });

      if (response.body?.data?.productDelete?.userErrors?.length > 0) {
        throw new Error(response.body.data.productDelete.userErrors[0].message);
      }

      // Refresh products after deletion
      fetchProducts();
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    loadMore,
    hasNextPage: pageInfo.hasNextPage,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
}

/**
 * Hook for fetching a single product by ID
 */
export function useAdminProductById(productId: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await shopifyAdminFetch({
        query: GET_PRODUCT_BY_ID.loc?.source.body || '',
        variables: { id: productId }
      });

      if (response.body?.data?.product) {
        setProduct(response.body.data.product);
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const updateProduct = useCallback(async (productInput: any) => {
    try {
      const response = await shopifyAdminFetch({
        query: UPDATE_PRODUCT.loc?.source.body || '',
        variables: {
          id: productId,
          input: productInput
        }
      });

      if (response.body?.data?.productUpdate?.userErrors?.length > 0) {
        throw new Error(response.body.data.productUpdate.userErrors[0].message);
      }

      // Refresh product after update
      fetchProduct();
      return response.body?.data?.productUpdate?.product;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }, [productId, fetchProduct]);

  return { product, loading, error, updateProduct, refreshProduct: fetchProduct };
}

/**
 * Hook for fetching inventory levels
 */
export function useInventoryLevels(initialPageSize = 20) {
  const [inventoryLevels, setInventoryLevels] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInventoryLevels = useCallback(async (cursor: string | null = null, pageSize = initialPageSize) => {
    try {
      setLoading(true);
      const response = await shopifyAdminFetch({
        query: GET_INVENTORY_LEVELS.loc?.source.body || '',
        variables: {
          first: pageSize,
          after: cursor
        }
      });

      if (response.body?.data?.inventoryLevels) {
        const { edges, pageInfo: newPageInfo } = response.body.data.inventoryLevels;
        const newInventoryLevels = edges.map((edge: any) => edge.node);
        
        setInventoryLevels(prevLevels => cursor ? [...prevLevels, ...newInventoryLevels] : newInventoryLevels);
        setPageInfo(newPageInfo);
      } else {
        throw new Error('Failed to fetch inventory levels');
      }
    } catch (err) {
      console.error('Error fetching inventory levels:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [initialPageSize]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      await fetchInventoryLevels(pageInfo.endCursor);
    }
  }, [fetchInventoryLevels, pageInfo]);

  useEffect(() => {
    fetchInventoryLevels();
  }, [fetchInventoryLevels]);

  const updateInventoryLevel = useCallback(async (inventoryLevelId: string, available: number) => {
    try {
      const response = await shopifyAdminFetch({
        query: UPDATE_INVENTORY_LEVEL.loc?.source.body || '',
        variables: {
          inventoryLevelId,
          available
        }
      });

      if (response.body?.data?.inventoryLevelUpdate?.userErrors?.length > 0) {
        throw new Error(response.body.data.inventoryLevelUpdate.userErrors[0].message);
      }

      // Refresh inventory levels after update
      fetchInventoryLevels();
      return response.body?.data?.inventoryLevelUpdate?.inventoryLevel;
    } catch (err) {
      console.error('Error updating inventory level:', err);
      throw err;
    }
  }, [fetchInventoryLevels]);

  return {
    inventoryLevels,
    loading,
    error,
    loadMore,
    hasNextPage: pageInfo.hasNextPage,
    updateInventoryLevel,
    refreshInventoryLevels: fetchInventoryLevels
  };
}

/**
 * Hook for fetching and managing orders
 */
export function useOrders(initialPageSize = 20) {
  const [orders, setOrders] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async (cursor: string | null = null, pageSize = initialPageSize, query = '') => {
    try {
      setLoading(true);
      const response = await shopifyAdminFetch({
        query: GET_ORDERS.loc?.source.body || '',
        variables: {
          first: pageSize,
          after: cursor,
          query
        }
      });

      if (response.body?.data?.orders) {
        const { edges, pageInfo: newPageInfo } = response.body.data.orders;
        const newOrders = edges.map((edge: any) => edge.node);
        
        setOrders(prevOrders => cursor ? [...prevOrders, ...newOrders] : newOrders);
        setPageInfo(newPageInfo);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [initialPageSize]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      await fetchOrders(pageInfo.endCursor);
    }
  }, [fetchOrders, pageInfo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = useCallback(async (orderId: string, orderInput: any) => {
    try {
      const response = await shopifyAdminFetch({
        query: UPDATE_ORDER.loc?.source.body || '',
        variables: {
          id: orderId,
          input: orderInput
        }
      });

      if (response.body?.data?.orderUpdate?.userErrors?.length > 0) {
        throw new Error(response.body.data.orderUpdate.userErrors[0].message);
      }

      // Refresh orders after update
      fetchOrders();
      return response.body?.data?.orderUpdate?.order;
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (orderId: string, reason: string) => {
    try {
      const response = await shopifyAdminFetch({
        query: CANCEL_ORDER.loc?.source.body || '',
        variables: {
          id: orderId,
          reason
        }
      });

      if (response.body?.data?.orderCancel?.userErrors?.length > 0) {
        throw new Error(response.body.data.orderCancel.userErrors[0].message);
      }

      // Refresh orders after cancellation
      fetchOrders();
      return response.body?.data?.orderCancel?.order;
    } catch (err) {
      console.error('Error canceling order:', err);
      throw err;
    }
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    loadMore,
    hasNextPage: pageInfo.hasNextPage,
    updateOrder,
    cancelOrder,
    refreshOrders: fetchOrders,
    searchOrders: (query: string) => fetchOrders(null, initialPageSize, query)
  };
}
