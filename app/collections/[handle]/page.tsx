"use client";

import { useState } from "react";
import { useCollectionProducts } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";

export default function CollectionPage({ params }: { params: { handle: string } }) {
  const { handle } = params;
  const { collection, products, loading, error, loadMore, hasNextPage } = useCollectionProducts(handle, 12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadMore();
    setIsLoadingMore(false);
  };

  if (loading && !isLoadingMore) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading collection. Please try again later.</p>
        </div>
        <Link href="/collections" className="text-blue-600 hover:underline">
          ← Back to collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <nav className="mb-6">
        <Link href="/collections" className="text-blue-600 hover:underline">
          ← Back to collections
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
        {collection.description && (
          <p className="text-gray-600">{collection.description}</p>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this collection.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const firstImage = product.images.edges[0]?.node;
              const price = product.priceRange.minVariantPrice.amount;
              const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product.priceRange.minVariantPrice.currencyCode,
              }).format(parseFloat(price));

              return (
                <Link 
                  href={`/products/${product.handle}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="relative h-64 w-full bg-gray-100">
                      {firstImage ? (
                        <Image
                          src={firstImage.url}
                          alt={firstImage.altText || product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-1">{product.title}</h2>
                      <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{formattedPrice}</span>
                        <span className="text-sm text-gray-500">
                          {product.availableForSale ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
