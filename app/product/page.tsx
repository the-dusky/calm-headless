"use client"

import { useState } from "react"
import { Star, Heart, Share2, Truck, Shield, Leaf, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("Forest Green")
  const [quantity, setQuantity] = useState(1)

  const sizes = ["S", "M", "L", "XL"]
  const colors = [
    { name: "Forest Green", class: "bg-green-600" },
    { name: "Navy Blue", class: "bg-blue-800" },
    { name: "Charcoal", class: "bg-gray-700" },
    { name: "Khaki", class: "bg-yellow-700" },
  ]

  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Made from recycled materials",
    },
    {
      icon: Shield,
      title: "Durable",
      description: "Built to last through adventures",
    },
    {
      icon: Truck,
      title: "Fast Dry",
      description: "Quick-drying fabric technology",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-40">
        <div className="px-4 py-3 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-0 mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-gray-900">Product Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Product Images */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div className="w-64 h-64 bg-green-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-white font-medium">Outdoor Shorts</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Shipping Badge */}
          <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Ships June 15th
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title and Rating */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Premium Outdoor Shorts</h1>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(127 reviews)</span>
            </div>
            <div className="text-2xl font-bold text-green-700">฿1,290</div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              Crafted in Thailand with premium materials, these outdoor shorts are perfect for hiking, camping, and
              everyday adventures. Features quick-dry technology and eco-friendly construction.
            </p>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Color: {selectedColor}</h3>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-12 h-12 rounded-full ${color.class} border-2 ${
                    selectedColor === color.name ? "border-gray-900" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Size: {selectedSize}</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 border rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 p-0"
              >
                -
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 p-0">
                +
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Scheduled Shipping</div>
                  <div className="text-sm text-blue-700">This item ships on June 15th, 2025</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <div className="space-y-3">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold">
              Add to Cart - ฿{(1290 * quantity).toLocaleString()}
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                View Shipping Calendar
              </Button>
            </Link>
          </div>

          {/* Product Details */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Material:</span>
                <span>65% Recycled Polyester, 35% Cotton</span>
              </div>
              <div className="flex justify-between">
                <span>Origin:</span>
                <span>Made in Thailand</span>
              </div>
              <div className="flex justify-between">
                <span>Care:</span>
                <span>Machine wash cold</span>
              </div>
              <div className="flex justify-between">
                <span>Fit:</span>
                <span>Regular fit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
