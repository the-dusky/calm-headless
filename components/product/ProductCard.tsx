"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      }
    };
    images: {
      edges: {
        node: {
          url: string;
          altText: string | null;
        }
      }[]
    };
    variants: {
      edges: {
        node: {
          id: string;
        }
      }[]
    };
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  // Get the first variant ID (default variant)
  const firstVariantId = product.variants.edges[0]?.node.id;
  
  // Get the first image
  const firstImage = product.images.edges[0]?.node;
  
  // Format price
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price);
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!firstVariantId) return;
    
    setIsAdding(true);
    try {
      await addToCart(firstVariantId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Product Image */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none h-80 relative">
        {firstImage ? (
          <Link href={`/products/${product.handle}`}>
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.handle}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{formattedPrice}</p>
        
        {/* Add to Cart Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || !firstVariantId}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
