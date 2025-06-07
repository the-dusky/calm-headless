"use client"

import { useState } from "react"
import { X, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CalendarPage() {
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const months = [
    {
      name: "June",
      color: "bg-gradient-to-br from-green-600 to-green-800",
      dates: ["15", "30"],
      available: true,
    },
    {
      name: "July",
      color: "bg-gradient-to-br from-gray-100 to-gray-200",
      dates: [],
      available: false,
    },
    {
      name: "August",
      color: "bg-gradient-to-br from-amber-700 to-amber-900",
      dates: ["15", "30"],
      available: true,
    },
    {
      name: "September",
      color: "bg-gradient-to-br from-orange-600 to-orange-800",
      dates: ["15", "30"],
      available: true,
    },
    {
      name: "October",
      color: "bg-gradient-to-br from-gray-300 to-gray-500",
      dates: ["15", "30"],
      available: true,
    },
    {
      name: "November",
      color: "bg-gradient-to-br from-blue-700 to-blue-900",
      dates: ["15", "30"],
      available: true,
    },
    {
      name: "December",
      color: "bg-gradient-to-br from-gray-600 to-gray-800",
      dates: ["15", "30"],
      available: true,
    },
  ]

  const toggleDate = (monthDate: string) => {
    setSelectedDates((prev) => (prev.includes(monthDate) ? prev.filter((d) => d !== monthDate) : [...prev, monthDate]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-camping.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <span className="text-2xl font-bold">CALM OUTDOORS</span>
            <div className="text-sm opacity-90 font-medium">STUDIO CAMPING</div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Shipping Calendar</h1>
          <p className="text-sm opacity-90">Select your delivery months</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Current Selection */}
        {selectedDates.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Selected Shipments</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date) => (
                  <span key={date} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {date}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Calendar */}
        <div className="space-y-4">
          {months.map((month, index) => (
            <div key={month.name} className="relative">
              <div className={`${month.color} rounded-2xl p-6 text-white relative overflow-hidden`}>
                {!month.available && (
                  <div className="absolute top-4 right-4">
                    <X className="w-6 h-6 text-gray-600" />
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-4">{month.name}</h2>

                {month.available && month.dates.length > 0 && (
                  <div className="space-y-3">
                    {month.dates.map((date) => {
                      const monthDate = `${month.name} ${date}`
                      const isSelected = selectedDates.includes(monthDate)

                      return (
                        <div
                          key={date}
                          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? "bg-white/30 backdrop-blur-sm border-2 border-white/50"
                              : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
                          }`}
                          onClick={() => toggleDate(monthDate)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl font-bold">{date}</div>
                            <div className="flex items-center space-x-2 text-sm opacity-90">
                              <Truck className="w-4 h-4" />
                              <span>
                                Ships {month.name} {date}th
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!month.available && (
                  <div className="text-center py-8 opacity-60">
                    <p className="text-gray-600">Coming Soon</p>
                  </div>
                )}
              </div>

              {/* Featured Product Preview for June */}
              {month.name === "June" && (
                <Card className="mt-4 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gray-100 p-6 flex items-center justify-center">
                      <div className="w-32 h-32 bg-green-600 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs font-medium">Green Shorts</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900">Featured: Outdoor Shorts</h4>
                      <p className="text-sm text-gray-600 mt-1">Premium Thai-made outdoor shorts</p>
                      <Link href="/product">
                        <Button variant="outline" size="sm" className="mt-3 w-full">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {selectedDates.length > 0 && (
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              Reserve Selected Shipments ({selectedDates.length})
            </Button>
          )}

          <Link href="/how-it-works">
            <Button variant="outline" className="w-full">
              How Does This Work?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
