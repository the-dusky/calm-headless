fix: Move Shopify API calls to server components

This commit fixes the empty product grid issue by moving Shopify Storefront API calls from client components to server components. The key changes include:

- Created server-side data fetching functions in `lib/shopify/server-actions.ts`
- Implemented a client-side `ProductGrid` component that receives server-fetched data
- Created an API route for client-side pagination at `/api/products`
- Fixed environment variable access by ensuring all API calls happen server-side
- Improved error handling with better logging and user feedback

This change ensures that the Shopify Storefront API is only accessed from server components where environment variables are properly available, resolving the "Missing SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN" error.
