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
- [ ] Set up GraphQL code generation for type safety (optional - we've created manual types for now)

### 2. Product Management
- [ ] Implement product listing components
- [ ] Build product detail page with variants
- [ ] Create collection/category views
- [ ] Add product search functionality
- [ ] Integrate with the existing calendar-based shipping UI

### 3. Cart Functionality
- [ ] Implement cart context/provider
- [ ] Build cart sidebar/drawer component
- [ ] Add product-to-cart functionality
- [ ] Create cart line item management (update quantity, remove)
- [ ] Implement cart totals and discounts

### 4. Checkout Integration
- [ ] Connect to Shopify Checkout
- [ ] Create checkout information forms
- [ ] Implement shipping method selection
- [ ] Add payment method integration
- [ ] Build order confirmation page

### 5. Account Management
- [ ] Create customer authentication flow
- [ ] Build account profile page
- [ ] Implement order history view
- [ ] Add address book management

### 6. Design Migration
- [ ] Transfer color schemes from Shopify theme
- [ ] Adapt typography styles
- [ ] Migrate custom components and layouts
- [ ] Ensure mobile responsiveness

### 7. Testing & Optimization
- [ ] Implement unit tests for key components
- [ ] Add integration tests for critical user flows
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Implement SEO best practices

### 8. Deployment
- [ ] Configure build process for production
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production environment
- [ ] Monitor performance and errors

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
