"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShopInfo, checkAdminApiAccess } from '@/lib/shopify/admin';

export default function AdminDashboard() {
  const { shop, loading: shopLoading, error: shopError } = useShopInfo();
  const [apiAccessible, setApiAccessible] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState<boolean>(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        setCheckingAccess(true);
        const hasAccess = await checkAdminApiAccess();
        setApiAccessible(hasAccess);
      } catch (error) {
        console.error('Error checking API access:', error);
        setApiAccessible(false);
      } finally {
        setCheckingAccess(false);
      }
    }

    checkAccess();
  }, []);

  if (checkingAccess || shopLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopify Admin Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (shopError || !apiAccessible) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopify Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Admin API Connection Error</h2>
          <p>Unable to connect to the Shopify Admin API. Please check your configuration:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Verify that your Admin API access token is correct in .env.local</li>
            <li>Ensure your access token has the necessary permissions</li>
            <li>Check that your store domain is correct</li>
          </ul>
        </div>
        <p className="text-gray-600 mb-4">
          You need to add a valid <code className="bg-gray-100 px-1 py-0.5 rounded">SHOPIFY_ADMIN_API_ACCESS_TOKEN</code> to your .env.local file.
        </p>
        <p className="text-gray-600">
          See the <a href="https://shopify.dev/docs/admin-api/getting-started" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Shopify Admin API documentation</a> for instructions on creating an access token.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopify Admin Dashboard</h1>
      
      {shop && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Store Name:</p>
              <p className="font-medium">{shop.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Domain:</p>
              <p className="font-medium">{shop.myshopifyDomain}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{shop.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Plan:</p>
              <p className="font-medium">{shop.plan?.displayName}</p>
            </div>
            <div>
              <p className="text-gray-600">Currency:</p>
              <p className="font-medium">{shop.currencyCode}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products" className="block">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600 mb-4">Manage your store's products and inventory</p>
            <span className="text-blue-600">View Products →</span>
          </div>
        </Link>
        
        <Link href="/admin/orders" className="block">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-gray-600 mb-4">View and manage customer orders</p>
            <span className="text-blue-600">View Orders →</span>
          </div>
        </Link>
        
        <Link href="/admin/settings" className="block">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 mb-4">Configure store settings and preferences</p>
            <span className="text-blue-600">View Settings →</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
