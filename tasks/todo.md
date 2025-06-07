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
- [ ] Create customer authentication flow
- [ ] Build account profile page
- [ ] Implement order history view
- [ ] Add address book management

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

### Next Steps
- Fix remaining TypeScript errors in product pages
- Continue implementing cart functionality with the Storefront API
- Add unit tests for the Storefront API client

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
