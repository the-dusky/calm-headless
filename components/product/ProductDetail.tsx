"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductDetailProps {
  product: Product | null;
  error: string | null;
}

export default function ProductDetail({ product, error }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  
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
      await addItem(selectedVariantId, quantity);
      
      // Navigate to cart page or show success message
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartError("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading product</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button 
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  // Format price
  const price = selectedVariant 
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode,
  }).format(price);

  // Get the first image
  const firstImage = product.images.edges[0]?.node;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 rounded-lg">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              width={600}
              height={600}
              className="object-cover object-center w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-6">{formattedPrice}</p>
          
          {/* Product Description */}
          <div className="prose prose-sm text-gray-500 mb-8" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          
          {/* Variant Selection */}
          {product.variants.edges.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.edges.map(({ node }) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedVariantId(node.id)}
                    className={`py-2 px-4 border rounded-md ${
                      selectedVariantId === node.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-l-md"
              >
                -
              </button>
              <span className="py-2 px-4 border-t border-b border-gray-300 text-center w-16">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div>
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariantId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
            
            {/* Error Message */}
            {addToCartError && (
              <p className="mt-2 text-sm text-red-600">{addToCartError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
