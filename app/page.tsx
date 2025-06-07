import { getProducts } from "@/lib/shopify/server-actions"
import ProductGrid from "@/components/product/ProductGrid"
import Link from "next/link"

export default async function HomePage() {
  // Fetch products server-side
  const { products, pageInfo, error } = await getProducts(12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-4">Calm Outdoors</h1>
          <p className="text-xl">Premium outdoor gear delivered on your schedule</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Product Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Products</h2>
          <ProductGrid 
            initialProducts={products || []} 
            hasNextPage={pageInfo?.hasNextPage || false} 
            error={error}
          />
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Select Your Products</h3>
              <p className="text-lg text-gray-600">We don't just deliver food, we're on a mission to make your outdoor adventures more enjoyable and sustainable.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Choose Your Shipping Dates</h3>
              <p className="text-gray-600 text-sm">
                Select from available shipping dates that work best for your schedule.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Enjoy Your Adventure</h3>
              <p className="text-gray-600 text-sm">
                Your gear arrives on your selected dates, ready for your outdoor experience.
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-bold mb-4">About Calm Outdoors</h2>
          <p className="text-gray-600">
            We provide premium outdoor gear delivered on your schedule. Whether you&apos;re planning a weekend camping trip or a month-long adventure, we have the equipment you need, delivered when you need it.
          </p>
          <div className="mt-4">
            <Link href="/calendar" className="text-blue-600 hover:underline">
              View our shipping calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
