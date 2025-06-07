"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminProducts } from '@/lib/shopify/admin';

export default function AdminProducts() {
  const {
    products,
    loading,
    error,
    loadMore,
    hasNextPage,
    deleteProduct
  } = useAdminProducts(20);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      setIsDeleting(id);
      setDeleteError(null);
      await deleteProduct(id);
    } catch (err) {
      console.error('Error deleting product:', err);
      setDeleteError('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
        <Link 
          href="/admin/products/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Product
        </Link>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{deleteError}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading products. Please try again later.</p>
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">You haven't created any products yet.</p>
              <Link 
                href="/admin/products/new" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Inventory</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => {
                    const firstImage = product.images?.edges[0]?.node;
                    const firstVariant = product.variants?.edges[0]?.node;
                    const price = firstVariant?.price;
                    const inventory = firstVariant?.inventoryQuantity;
                    const formattedPrice = price 
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.priceRangeV2?.minVariantPrice?.currencyCode || 'USD'
                        }).format(parseFloat(price))
                      : 'N/A';

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 relative mr-3 flex-shrink-0">
                              {firstImage ? (
                                <Image
                                  src={firstImage.url}
                                  alt={product.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.productType || 'No type'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'ACTIVE' ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {inventory !== undefined ? inventory : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {formattedPrice}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link 
                              href={`/admin/products/${product.id}`} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isDeleting === product.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {hasNextPage && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
