"use client";

import { useEffect } from 'react';
import { useCart } from '@/lib/context/cart-context';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { 
    cart, 
    isLoading, 
    updateCartItem, 
    removeFromCart 
  } = useCart();
  
  // Format cart items for display
  const cartItems = cart?.lines.edges.map(({ node }) => ({
    id: node.id,
    title: node.merchandise.product.title,
    variantTitle: node.merchandise.title,
    handle: node.merchandise.product.handle,
    quantity: node.quantity,
    price: parseFloat(node.merchandise.price.amount),
    image: node.merchandise.product.images.edges[0]?.node.url || '',
    imageAlt: node.merchandise.product.images.edges[0]?.node.altText || node.merchandise.product.title,
  })) || [];
  
  // Calculate cart totals
  const subtotal = cart?.cost.subtotalAmount.amount 
    ? parseFloat(cart.cost.subtotalAmount.amount) 
    : 0;
  const total = cart?.cost.totalAmount.amount 
    ? parseFloat(cart.cost.totalAmount.amount) 
    : 0;
  const taxes = cart?.cost.totalTaxAmount?.amount 
    ? parseFloat(cart.cost.totalTaxAmount.amount) 
    : 0;
  
  // Handle quantity changes
  const handleQuantityChange = async (lineId: string, quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem(lineId, quantity);
  };
  
  // Handle item removal
  const handleRemoveItem = async (lineId: string) => {
    await removeFromCart(lineId);
  };
  
  // Empty cart view
  if (!isLoading && (!cart || cartItems.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Items ({cartItems.length})</h2>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100px, 150px"
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link href={`/products/${item.handle}`} className="text-lg font-medium hover:text-blue-600">
                      {item.title}
                    </Link>
                    {item.variantTitle !== "Default Title" && (
                      <p className="text-sm text-gray-500 mt-1">{item.variantTitle}</p>
                    )}
                    <p className="text-lg font-semibold mt-2">{formatPrice(item.price)}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-4 md:mt-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="p-6">
                <Link 
                  href="/products" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="mr-2">←</span> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              {cart?.checkoutUrl && (
                <a 
                  href={cart.checkoutUrl}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Proceed to Checkout
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
