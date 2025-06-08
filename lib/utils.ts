import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price with currency symbol
 * @param price - Price as a number
 * @param currencyCode - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price)
}
