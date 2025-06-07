"use client";

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';

export default function CartEmpty() {
  const { closeCart } = useCart();
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <ShoppingBagIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
      <p className="mt-1 text-sm text-gray-500">
        Start adding some products to your cart!
      </p>
      <div className="mt-6">
        <Link
          href="/products"
          onClick={closeCart}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
