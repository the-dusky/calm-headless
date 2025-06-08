"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart"
import { useAuth } from "@/components/auth/AuthProvider"
import LoginButton from "@/components/auth/LoginButton"
import LogoutButton from "@/components/auth/LogoutButton"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, isLoading, customer } = useAuth()

  const navItems = [
    { href: "/", label: "Calendar" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/community", label: "Community" },
    { href: "/product", label: "Products" },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-700 text-white p-2 rounded-lg">
              <span className="font-bold text-lg">CALM</span>
            </div>
            <span className="text-gray-600 text-sm hidden sm:block font-medium">outdoors</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-green-700 border-b-2 border-green-700 pb-4"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : isAuthenticated ? (
              <Link href="/account" className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-green-700">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{customer?.firstName || 'Account'}</span>
              </Link>
            ) : (
              <LoginButton className="text-sm font-medium text-gray-600 hover:text-green-700">
                Sign In
              </LoginButton>
            )}
            
            <CartButton />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Account links for mobile */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    My Account
                  </Link>
                  <LogoutButton className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-orange-600 hover:bg-gray-50 text-left" />
                </>
              ) : (
                <LoginButton className="text-sm font-medium px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-orange-600 hover:bg-gray-50 text-left">
                  Sign In
                </LoginButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
