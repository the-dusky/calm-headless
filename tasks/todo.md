# Shopify Headless API Integration Plan

## Overview
Connect the Next.js app to Shopify's headless API to replace the traditional Shopify theme. This will allow us to maintain the modern React-based UI while leveraging Shopify's e-commerce functionality.

## Analysis

### Current State
- Next.js app with a calendar-based UI for scheduled shipments
- Modern component structure using React and Tailwind CSS
- No current integration with Shopify's commerce functionality

### Target State
- Maintain the existing UI/UX while adding Shopify's commerce capabilities
- Connect to Shopify's Storefront API for product data
- Implement cart and checkout functionality
- Preserve the calendar-based shipping concept

## Todo Items

### 1. Setup & Configuration
- [x] Install required dependencies (`@shopify/hydrogen-react`, `graphql`)
- [x] Set up environment variables for Shopify API credentials (store domain, Storefront API access tokens)
- [x] Create a Shopify client utility using the Storefront API
  - Created `/lib/shopify/client.ts` with `shopifyClient` and `shopifyFetch` functions
  - Created `/lib/shopify/types.ts` with TypeScript interfaces for Shopify data
  - Created `/lib/shopify/queries.ts` with GraphQL queries for products, collections, cart
  - Created `/lib/shopify/hooks.ts` with React hooks for data fetching
  - Created `/lib/shopify/index.ts` to export all utilities
- [x] Set up GraphQL code generation for type safety

### 2. Product Management
- [x] Implement product listing components
- [x] Build product detail page with variants
- [x] Create collection/category views
- [x] Add product search functionality

### 3. Shopify Admin Integration
- [x] ~~Set up Admin API authentication~~ (Removed - focusing on Storefront API only)
- [x] ~~Create product management interface~~ (Removed - focusing on Storefront API only)
- [x] ~~Implement inventory management~~ (Removed - focusing on Storefront API only)
- [x] ~~Add order management capabilities~~ (Removed - focusing on Storefront API only)
- [x] ~~Build store settings configuration~~ (Removed - focusing on Storefront API only)

### 4. Cart Functionality
- [x] Implement cart context/provider
- [x] Build cart sidebar/drawer component
- [x] Add product-to-cart functionality
- [x] Create cart line item management (update quantity, remove)
- [x] Implement cart totals and discounts
- [x] Refactor cart context to use server-side API routes instead of direct Shopify API calls
- [x] Create API routes for cart operations (create, add, update, remove, get)
- [ ] Create dedicated cart page

### 5. API Debugging & Authentication Fixes
- [x] Fix GraphQL playground authentication issues
  - [x] Update client.ts to properly handle environment variables
  - [x] Update admin/client.ts to properly handle authentication
  - [x] Fix error handling in GraphQL playground
  - [x] Remove Admin API dependency
- [x] Ensure proper token usage in all API requests
  - [x] Verify Storefront API token usage
  - [x] Remove Admin API token requirement
  - [ ] Test Storefront API connections with proper error reporting
- [x] Fix environment variable loading issues
  - [x] Create environment utility functions
  - [x] Fix environment variable detection in scripts
  - [x] Make Admin API token optional

### 5.1 Remove Admin API Dependency
- [x] Update GraphQL playground to remove Admin API option
  - [x] Remove Admin API tab and sample queries
  - [x] Update environment status display
  - [x] Focus UI on Storefront API only
- [x] Clean up Admin API related code
  - [x] Make Admin client optional or remove if not needed
  - [x] Update environment variable checks
  - [x] Update API test endpoint

### 5.2 Fix GraphQL Code Generation Issues
- [x] Fix duplicate type definitions in generated GraphQL code
  - [x] Clean up existing generated files
  - [x] Update codegen configuration to prevent duplicates
  - [x] Regenerate GraphQL types
- [x] Fix client to handle DocumentNode queries
  - [x] Update shopifyFetch to accept DocumentNode type
  - [x] Use print() function to convert DocumentNode to string
- [x] Fix GraphQL playground to work with private environment variables
  - [x] Create server-side API endpoint for GraphQL queries
  - [x] Update playground to use the API endpoint instead of direct client access
- [x] Fix TypeScript errors related to GraphQL types
  - [x] Fixed duplicate type definitions (reduced errors from 2,935 to 39)
  - [x] Fixed admin hook errors by removing unused admin API code
  - [ ] Fix remaining type errors in product pages

### 5.3 Simplify Environment Variable Handling
- [x] Remove environment utility functions
  - [x] Update Storefront API client to reference env vars directly
  - [x] Update Admin API client to reference env vars directly
  - [x] Update API test endpoint to reference env vars directly
  - [x] Update GraphQL playground to reference env vars directly
- [x] Ensure proper error handling is maintained
- [x] Remove the now-unused env.ts file

### 6. Product & Cart Integration with Calendar UI
- [ ] Connect product selection to calendar-based shipping UI
- [ ] Integrate cart functionality with shipping date selection
- [ ] Implement shipping date validation and availability
- [ ] Create unified checkout flow with calendar shipping options

### 6. Checkout Integration
- [ ] Connect to Shopify Checkout
- [ ] Create checkout information forms
- [ ] Implement shipping method selection
- [ ] Add payment method integration
- [ ] Build order confirmation page

### 7. Account Management

#### 7.1 Customer Authentication
- [x] Research Shopify Customer Authentication options
  - [x] Evaluate Shopify Customer Accounts API
  - [x] Evaluate Shopify Multipass for SSO
  - [x] Determine best approach for our Next.js application
- [x] Create detailed Customer Account API implementation plan
  - [x] Document OAuth2 authentication flow
  - [x] Outline required components and security considerations
  - [x] Define implementation tasks and phases
- [x] Set up OAuth2 configuration
  - [x] Configure environment variables for Customer Account API
  - [x] Create authentication utility functions in `lib/shopify/customer-account-api/auth.ts`
- [x] Implement OAuth2 authentication flow
  - [x] Create authorization URL generation function
  - [x] Implement token exchange functionality
  - [x] Add token refresh mechanism
  - [x] Create token revocation for logout
- [x] Create Customer Account API client
  - [x] Implement GraphQL client for Customer Account API
  - [x] Add queries and mutations for customer data operations
  - [x] Create server actions for customer operations
- [x] Build authentication UI components
  - [x] Create login initiation button/link
  - [x] Implement OAuth callback handling
  - [x] Add logout functionality
  - [x] Integrate auth components into navigation
- [x] Implement authentication state management
  - [x] Create customer context provider
  - [x] Add loading and error states
  - [x] Implement auth state persistence with HTTP-only cookies
- [ ] Test and debug authentication flow
  - [ ] Test login flow with Shopify
  - [ ] Test token refresh mechanism
  - [ ] Test logout functionality

#### 7.2 Customer Account Pages
- [ ] Create account dashboard page
  - [ ] Design account overview UI
  - [ ] Display customer information summary
  - [ ] Add quick links to other account sections
- [ ] Build profile management page
  - [ ] Create profile edit form
  - [ ] Implement profile update functionality
  - [ ] Add profile picture upload (if applicable)
- [ ] Implement order history view
  - [ ] Create order list component
  - [ ] Build order detail page
  - [ ] Add order filtering and sorting
  - [ ] Implement order status tracking
- [ ] Add address book management
  - [ ] Create address list component
  - [ ] Build address add/edit forms
  - [ ] Implement address deletion
  - [ ] Add default address selection

#### 7.3 Security & Privacy
- [ ] Implement secure token storage
- [ ] Add CSRF protection
- [ ] Create account recovery options
- [ ] Add two-factor authentication (if applicable)
- [ ] Implement privacy preferences management

## Review - June 7, 2025 (Part 7)

### Completed Tasks
- Researched Shopify Customer Authentication options
- Created detailed account management implementation plan
- Added customer-related types to types.ts
- Created GraphQL queries and mutations for customer authentication and account management
- Implemented server actions for customer authentication and account management
- Started creating API routes for client-side authentication

### Next Steps
- Complete API routes for customer authentication and account management
- Create customer authentication context provider
- Build UI components for login, registration, and account management
- Create account pages
- Test the authentication flow end-to-end

### 8. Design Migration
- [ ] Transfer color schemes from Shopify theme
- [ ] Adapt typography styles
- [ ] Migrate custom components and layouts
- [ ] Ensure mobile responsiveness

### 9. Testing & Optimization
- [ ] Implement unit tests for key components
- [ ] Add integration tests for critical user flows
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Implement SEO best practices

### 10. Deployment
- [ ] Configure build process for production
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production environment
- [ ] Monitor performance and errors

## Review - June 7, 2025 (Part 6)

### Completed Tasks
- Fixed security issues by moving all Shopify API calls requiring private tokens to server-side
- Created server actions for cart operations in `lib/shopify/server-actions.ts`
- Created API routes for cart operations at `/api/cart/create` and `/api/cart/[id]`
- Refactored cart context to use server-side API routes instead of direct Shopify API calls
- Fixed TypeScript errors in server-actions.ts and types.ts
- Updated todo.md with current progress and next steps

### Key Architectural Changes
- Eliminated all client-side access to private Shopify tokens
- Created a secure server-side API layer for all cart operations
- Implemented proper error handling for cart operations
- Maintained the same cart functionality while fixing the security issues
- Improved type safety with better TypeScript definitions

## Review - June 7, 2025 (Part 5)

### Completed Tasks
- Fixed product page error by converting it to use server-side data fetching
- Created a client-side `ProductDetail` component for handling product UI and cart interactions
- Added API route for single product fetching at `/api/products/[handle]`
- Added SEO metadata generation for product pages
- Improved error handling for product not found scenarios

### Key Architectural Changes
- Converted product page to a server component that fetches data server-side
- Created a clear separation between server-side data fetching and client-side UI
- Added proper error handling for product not found cases
- Implemented SEO metadata generation based on product data
- Maintained the same UI/UX while fixing the core data fetching issue

### Next Steps

1. ✅ Fix Shopify Storefront API integration by moving private token access to server-side
2. ✅ Refactor product page to use server-side data fetching
3. ✅ Create server actions for cart operations
4. ✅ Create API routes for cart operations
5. ✅ Refactor cart context to use server-side API routes
6. 🔄 Create dedicated cart page
7. 🔄 Test the end-to-end user flow
8. Deploy the integrated solution

## Review - June 7, 2025 (Part 4)

### Completed Tasks
- Fixed the empty product grid issue by moving Shopify API calls to server components
- Created server-side data fetching functions in `lib/shopify/server-actions.ts`
- Implemented a client-side `ProductGrid` component that receives server-fetched data
- Created an API route for client-side pagination at `/api/products`
- Maintained the same UI/UX while fixing the core data fetching issue
- Fixed TypeScript errors related to imports and component structure

### Key Architectural Changes
- Moved Shopify Storefront API calls from client components to server components
- Created a clear separation between data fetching (server) and UI rendering (client)
- Implemented a hybrid approach with server-side initial data load and client-side pagination
- Fixed environment variable access by ensuring all API calls happen server-side
- Improved error handling with better logging and user feedback

### Next Steps
- [x] Fix product page error by converting it to use server-side data fetching
- [ ] Create a dedicated cart page at "/cart" to handle the redirect from product pages
- [ ] Continue implementing cart functionality with the Storefront API
- [ ] Add unit tests for the server-side data fetching functions
- [ ] Implement sorting and filtering options for the product grid

## Review - June 7, 2025 (Part 3)

### Completed Tasks
- Implemented a product grid on the home page to display all products
- Replaced the calendar-based home page with a product catalog view
- Reused the existing ProductCard component for consistent product display
- Added loading states and error handling for the product grid
- Implemented pagination with a "Load More" button
- Fixed build issues by clearing the Next.js cache

### Key Architectural Changes
- Created a more direct shopping experience by showing products on the home page
- Maintained a link to the calendar view for users who want to use that feature
- Used the existing Shopify hooks for data fetching to ensure consistency
- Implemented a responsive design that works well on all device sizes

### Next Steps
- [x] Fix the empty product grid issue by moving API calls to server components
- [ ] Create a dedicated cart page at "/cart" to handle the redirect from product pages
- [ ] Continue implementing cart functionality with the Storefront API
- [ ] Add unit tests for the Storefront API client
- [ ] Implement sorting and filtering options for the product grid

## Review - June 7, 2025 (Part 2)

### Completed Tasks
- Removed unused Shopify Admin API code to simplify the codebase
- Deleted the entire admin directory from lib/shopify
- Updated admin pages with placeholders to maintain navigation structure
- Updated todo.md to reflect the decision to focus only on Storefront API
- Fixed TypeScript errors related to admin hooks by removing the unused code

### Key Architectural Changes
- Simplified the codebase by removing unused Admin API integration
- Reduced TypeScript errors by eliminating problematic admin hooks
- Maintained the application structure to allow for easy restoration of admin features if needed in the future

## Review - June 7, 2025 (Part 1)

### Completed Tasks
- Simplified environment variable handling by removing the env.ts utility file and accessing environment variables directly
- Fixed the GraphQL playground to work with private environment variables by creating a server-side API endpoint
- Updated the Shopify client to handle DocumentNode queries properly using the print function
- Removed all dependencies on the env utility functions throughout the codebase
- Improved error handling for missing environment variables with clear error messages
- Fixed GraphQL code generation to prevent duplicate type definitions
- Reduced TypeScript errors from 2,935 to just 39

### Key Architectural Changes
- Moved GraphQL query execution from client-side to server-side for better security and proper access to environment variables
- Simplified the codebase by removing an abstraction layer (env utility) that was hiding potential issues
- Made the code more maintainable by directly accessing environment variables where they're needed
- Improved GraphQL code generation configuration to prevent duplicate type definitions
- Created a dedicated server-side API endpoint for GraphQL operations

### Next Steps
- Fix remaining TypeScript errors in admin hooks and product pages (reduced from 2,935 to 39)
- Continue implementing cart functionality with the Storefront API
- Add unit tests for the new server-side GraphQL API endpoint

## Review - June 6, 2025

### Completed Tasks
- Set up the foundation for Shopify headless API integration
- Installed required dependencies (`@shopify/hydrogen-react`, `graphql`) with `--legacy-peer-deps` to resolve dependency conflicts
- Created environment variables for Shopify API credentials
- Implemented a comprehensive Shopify client utility with:
  - API client configuration
  - GraphQL query execution
  - TypeScript types for Shopify data
  - React hooks for data fetching
  - Cart management functions

### Next Steps
1. Begin implementing product management components:
   - Create a product listing page component
   - Build a product detail page with variant selection
   - Integrate with the existing calendar-based shipping UI

2. Test the Shopify API connection with real data:
   - Fetch products from the store
   - Display product information
   - Ensure proper error handling

### Notes
- Used the latest Shopify Hydrogen React library for integration
- Created a flexible architecture that can be extended as needed
- Maintained compatibility with the existing Next.js app structure
- Resolved dependency conflicts with date-fns using --legacy-peer-deps

## Review - June 7, 2025 (Part 6)

### Completed Tasks - Customer Account API Implementation
- Implemented Shopify Customer Account API with OAuth2 authentication
- Created secure token storage using HTTP-only cookies
- Implemented authentication context provider for global auth state management
- Added login/logout functionality with Shopify-hosted login page
- Created protected account page with customer profile information
- Integrated authentication UI components in site navigation
- Fixed TypeScript errors and build issues

### Key Architectural Components
- Authentication utilities (`lib/shopify/customer-account-api/auth.ts`)
  - OAuth2 flow functions (authorization URL generation, token exchange, refresh, revocation)
  - Secure token storage using HTTP-only cookies
  - Helper functions for authentication state management
- Customer API client (`lib/shopify/customer-account-api/client.ts`)
  - GraphQL client for making authenticated requests
  - Error handling and response processing
- GraphQL queries and mutations (`lib/shopify/customer-account-api/queries.ts`)
  - Customer profile operations
  - Order history retrieval
  - Address management
- Server actions (`lib/shopify/customer-account-api/actions.ts`)
  - OAuth flow implementation
  - Customer data operations
- API routes
  - `/api/auth/login` - Initiates the login flow
  - `/authorize` - Handles OAuth callback
  - `/api/auth/logout` - Handles logout
  - `/api/auth/customer` - Fetches customer data
- React components
  - `AuthProvider` - Context provider for authentication state
  - `LoginButton` - Component for initiating login
  - `LogoutButton` - Component for handling logout

### Next Steps
1. Test the OAuth flow with Shopify
   - Configure callback URIs in Shopify admin
   - Test login, token refresh, and logout flows
   - Verify error handling

2. Complete the account management pages
   - Implement order history page
   - Create address book management
   - Add profile editing functionality

3. Integrate with cart and checkout
   - Connect authenticated customer to cart
   - Enable saved addresses in checkout
   - Support order history tracking
