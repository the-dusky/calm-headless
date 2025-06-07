"use client"

import { useState } from "react"
import ProductCard from "@/components/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Product } from "@/lib/shopify/types"

interface ProductGridProps {
  initialProducts: Product[]
  hasNextPage?: boolean
  error?: string | null
}

export default function ProductGrid({ 
  initialProducts,
  hasNextPage = false,
  error = null
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(error)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(hasNextPage)

  // Function to load more products
  const loadMore = async () => {
    try {
      setLoading(true)
      const lastProduct = products[products.length - 1]
      const cursor = lastProduct?.id || null
      
      const response = await fetch(`/api/products?after=${cursor}&first=12`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load more products')
      }
      
      setProducts([...products, ...data.products])
      setHasMore(data.pageInfo.hasNextPage)
      setCurrentPage(currentPage + 1)
    } catch (err) {
      setLoadingError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Handle errors
  if (loadingError && products.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading products</h2>
        <p className="text-gray-600 mb-6">{loadingError}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button 
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Products'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}
