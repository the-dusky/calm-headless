"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/lib/context/cart-context';
import type { CartLine } from '@/lib/context/cart-context';

interface CartLineItemProps {
  item: CartLine;
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { id, quantity, merchandise } = item;
  const { product, price } = merchandise;
  const image = product.images.edges[0]?.node;

  // Format currency
  const formatCurrency = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  // Handle quantity change
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    if (newQuantity === quantity) return;

    setIsUpdating(true);
    await updateCartItem(id, newQuantity);
    setIsUpdating(false);
  };

  // Handle item removal
  const handleRemove = async () => {
    setIsRemoving(true);
    await removeFromCart(id);
    setIsRemoving(false);
  };

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link href={`/products/${product.handle}`} className="hover:underline">
                {product.title}
              </Link>
            </h3>
            <p className="ml-4">
              {formatCurrency(price.amount, price.currencyCode)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{merchandise.title !== 'Default Title' ? merchandise.title : ''}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <label htmlFor={`quantity-${id}`} className="mr-2 text-gray-500">
              Qty
            </label>
            <select
              id={`quantity-${id}`}
              name={`quantity-${id}`}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              disabled={isUpdating}
              className="rounded-md border border-gray-300 text-base py-1 px-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {isUpdating && (
              <span className="ml-2 text-xs text-gray-500">Updating...</span>
            )}
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
