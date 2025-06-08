fix: Convert product page to use server-side data fetching

This commit fixes the product page error by moving Shopify API calls from client components to server components. The key changes include:

- Converted product page to a server component that fetches data server-side
- Created a client-side ProductDetail component for handling product UI and cart interactions
- Added API route for single product fetching at `/api/products/[handle]`
- Added SEO metadata generation for product pages
- Improved error handling for product not found scenarios

This change ensures that the Shopify Storefront API is only accessed from server components where environment variables are properly available, resolving the "Missing SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN" error on product pages.
