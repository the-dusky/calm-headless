"use client";

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopify Admin Dashboard</h1>
      <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Admin API Not Configured</h2>
        <p>The Shopify Admin API integration has been temporarily removed from this application.</p>
        <p className="mt-2">This feature will be added back in a future update when needed.</p>
      </div>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
