"use client";

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/context/cart-context';

export default function CartButton() {
  const { toggleCart, cartCount } = useCart();
  
  return (
    <button
      type="button"
      className="relative rounded-full bg-white p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={toggleCart}
    >
      <span className="sr-only">Open cart</span>
      <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}
