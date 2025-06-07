# Remove Shopify Admin API and Fix TypeScript Errors

## Changes Made
- Removed unused Shopify Admin API code (hooks, client, queries)
- Updated admin pages with placeholders for removed functionality
- Fixed TypeScript errors in product pages and search functionality
- Added Suspense boundary to search page for proper client-side rendering
- Updated todo.md to reflect completed tasks
- Updated CHANGELOG.md with version 0.2.0

## Details
- Deleted the entire admin directory from lib/shopify
- Fixed product page to use correct cart hook methods
- Fixed product variant option handling
- Fixed search page type definitions and added Suspense boundary
- Resolved all remaining TypeScript errors (reduced from 39 to 0)

## Testing
- Verified TypeScript compiles without errors
- Confirmed admin pages display appropriate placeholders
- Verified product pages still function correctly with cart integration

This commit completes the task of removing unused Shopify Admin API code and focusing development on the Storefront API integration.
