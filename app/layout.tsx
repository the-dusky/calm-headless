import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { CartProvider } from "@/lib/context/cart-context"
import { CartDrawer } from "@/components/cart"
import { AuthProvider } from "@/components/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calm Outdoors - Thai Outdoor Gear",
  description: "Scheduled shipments of premium outdoor gear from Thailand",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            <Navigation />
            <CartDrawer />
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
