"use client"

import { Calendar, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Calendar,
      title: "Choose Your Month",
      description:
        "Select the months you want to receive your outdoor gear. We ship twice monthly on the 15th and 30th.",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: Package,
      title: "We Place Orders",
      description:
        "We coordinate with our Thai suppliers to place bulk orders for specific shipping dates, ensuring fresh inventory.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: Clock,
      title: "Production & Quality",
      description:
        "Your items are carefully crafted and quality-checked in Thailand before being prepared for shipment.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Truck,
      title: "Scheduled Delivery",
      description:
        "Your gear ships exactly on the advertised dates - no delays, no surprises. Track your package every step of the way.",
      color: "bg-stone-100 text-stone-700",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="relative h-64 md:h-80 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-camping.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <span className="text-2xl font-bold">CALM OUTDOORS</span>
            <div className="text-sm opacity-90 font-medium">STUDIO CAMPING</div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">How It Works</h1>
          <p className="text-lg opacity-90 max-w-md">Predictable outdoor gear delivery from Thailand to your door</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:py-12 max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Scheduled Shipments Made Simple</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unlike traditional e-commerce, we coordinate with our Thai suppliers to ensure your gear ships exactly when
            we promise. No inventory guessing, no delays.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Step Number & Icon */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center relative">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${step.color} flex items-center justify-center`}
                  >
                    <step.icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-1/2 w-0.5 h-16 bg-gray-200 transform -translate-x-1/2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Scheduled Shipments?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-0 shadow-sm bg-green-50">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Guaranteed Dates</h4>
              <p className="text-gray-600 text-sm">Your gear ships exactly when promised - no inventory surprises</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm bg-blue-50">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Direct from Thailand</h4>
              <p className="text-gray-600 text-sm">Fresh inventory straight from our trusted Thai suppliers</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm bg-orange-50">
              <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Quality Assured</h4>
              <p className="text-gray-600 text-sm">Every item is quality-checked before shipment</p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg opacity-90 mb-6 max-w-md mx-auto">
              Browse our upcoming shipment dates and reserve your outdoor gear today.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8">
                View Shipping Calendar
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
