"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify/client";
import { GET_PRODUCTS_BY_SEARCH } from "@/lib/shopify/queries";
import { DocumentNode } from "graphql";
import Link from "next/link";
import Image from "next/image";

type SearchProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  availableForSale: boolean;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
    
    if (query) {
      searchProducts(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shopifyFetch<{ products: { edges: Array<{ node: SearchProduct }> } }>({ 
        query: GET_PRODUCTS_BY_SEARCH as unknown as string,
        variables: {
          query: searchQuery,
          first: 24
        }
      });
      
      // Type the response properly
      const data = response.body;
      
      if (data && data.products && data.products.edges) {
        setProducts(data.products.edges.map((edge: { node: SearchProduct }) => edge.node));
      } else {
        setError("Failed to load search results");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex w-full max-w-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>
      
      {query && (
        <p className="mb-4 text-gray-600">
          {loading 
            ? "Searching..." 
            : `${products.length} results for "${query}"`}
        </p>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {products.length === 0 && query ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your search.</p>
              <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
                Browse all products
              </Link>
            </div>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 px-4">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
