"use client";

import { useState } from "react";
import { useProduct } from "@/lib/shopify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/shopify";

export default function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = params;
  const router = useRouter();
  const { product, loading, error } = useProduct(handle);
  const { addToCart, createCart } = useCart();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);

  // Select the first variant by default when product loads
  if (product && !selectedVariantId && product.variants.edges.length > 0) {
    setSelectedVariantId(product.variants.edges[0].node.id);
  }

  const selectedVariant = product?.variants.edges.find(
    ({ node }) => node.id === selectedVariantId
  )?.node;

  const handleAddToCart = async () => {
    if (!selectedVariantId || !product) return;
    
    setIsAddingToCart(true);
    setAddToCartError(null);
    
    try {
      await addToCart({
        lines: [
          {
            merchandiseId: selectedVariantId,
            quantity
          }
        ]
      });
      
      // Navigate to cart page or show success message
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartError("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-20 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading product. Please try again later.</p>
        </div>
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const images = product.images.edges.map(({ node }) => node);
  const variants = product.variants.edges.map(({ node }) => node);
  const hasMultipleVariants = variants.length > 1;
  
  // Get unique option names and values
  const optionNames = product.options.map(option => option.name);
  
  const variantOptions = optionNames.map(name => {
    const values = new Set<string>();
    variants.forEach(variant => {
      const option = variant.selectedOptions.find(opt => opt.name === name);
      if (option) values.add(option.value);
    });
    return {
      name,
      values: Array.from(values)
    };
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <nav className="mb-6">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative">
          {images.length > 0 ? (
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={images[0].url}
                alt={images[0].altText || product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {images.slice(0, 5).map((image, index) => (
                <div 
                  key={image.id} 
                  className="relative h-20 bg-gray-100 rounded cursor-pointer"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `Product image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
          {/* Price */}
          <div className="text-xl font-medium mb-4">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.priceRange.minVariantPrice.currencyCode,
            }).format(parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount))}
          </div>
          
          {/* Description */}
          <div className="prose mb-6">
            <p>{product.description}</p>
          </div>
          
          {/* Variant Selection */}
          {hasMultipleVariants && (
            <div className="mb-6">
              {variantOptions.map((option) => (
                <div key={option.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {option.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      // Find a variant that matches the current selection plus this option value
                      const matchingVariant = variants.find(variant => {
                        const currentOption = variant.selectedOptions.find(opt => opt.name === option.name);
                        return currentOption?.value === value;
                      });
                      
                      const isSelected = selectedVariant?.selectedOptions.some(
                        opt => opt.name === option.name && opt.value === value
                      );
                      
                      return (
                        <button
                          key={value}
                          className={`px-4 py-2 border rounded-md ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${!matchingVariant?.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (matchingVariant?.availableForSale) {
                              setSelectedVariantId(matchingVariant.id);
                            }
                          }}
                          disabled={!matchingVariant?.availableForSale}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b border-gray-300 text-center"
              />
              <button
                className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant?.availableForSale}
              className={`w-full py-3 px-6 rounded-md text-white font-medium ${
                selectedVariant?.availableForSale
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isAddingToCart
                ? 'Adding...'
                : !selectedVariant?.availableForSale
                ? 'Out of Stock'
                : 'Add to Cart'}
            </button>
            
            {addToCartError && (
              <p className="mt-2 text-red-600 text-sm">{addToCartError}</p>
            )}
            
            {!selectedVariant?.availableForSale && (
              <p className="mt-2 text-gray-500 text-sm">This product is currently out of stock.</p>
            )}
          </div>
          
          {/* Product Metadata */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">SKU:</span>{' '}
                {selectedVariant?.sku || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Availability:</span>{' '}
                {selectedVariant?.availableForSale ? 'In stock' : 'Out of stock'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
