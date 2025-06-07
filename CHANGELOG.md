# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.2.3] - 2025-06-07

### Fixes
- Fixed product page error by converting it to use server-side data fetching
- Created ProductDetail client component to handle product UI and cart interactions
- Added API route for single product fetching at `/api/products/[handle]`
- Added SEO metadata generation for product pages
- Improved error handling for product not found scenarios

## [0.2.2] - 2025-06-07

### Fixes
- Fixed empty product grid issue by moving Shopify API calls to server components
- Created server-side data fetching functions for proper environment variable access
- Implemented hybrid approach with server-side initial data load and client-side pagination
- Added API route for client-side pagination at `/api/products`
- Improved error handling with better logging and user feedback

## [0.2.1] - 2025-06-07

### Features
- Added product grid to home page for direct product browsing
- Implemented pagination with "Load More" functionality
- Added loading states and error handling for product fetching
- Created responsive layout for optimal viewing on all devices
- Added link to calendar view for users who prefer the scheduled shipping interface

## [0.2.0] - 2025-06-07

### Improvements
- Simplified codebase by removing unused Shopify Admin API integration
- Reduced bundle size by eliminating unused code
- Updated admin pages with clear placeholders for removed functionality
- Streamlined environment variable requirements by removing Admin API dependencies

### Fixes
- Fixed TypeScript errors in product pages by updating type definitions
- Fixed cart functionality in product page to use correct hook methods
- Fixed search page type definitions for proper GraphQL response handling
- Fixed product variant option handling to extract data correctly from variants
- Added Suspense boundary to search page for proper client-side rendering
- Resolved all TypeScript errors (reduced from 39 to 0)

## [0.1.0] - 2025-06-06

### Features
- Initial setup for Shopify headless API integration
- Implemented product detail page with variant selection
- Added collection browsing functionality with collection listing and detail pages
- Created product search functionality with query parameter support
- Created Admin dashboard with product management interface

### Improvements
- Installed required dependencies (`@shopify/hydrogen-react`, `graphql`)
- Created environment variable configuration for Shopify API credentials
- Implemented Shopify client utility for API communication
- Added GraphQL queries for products, collections, and cart operations
- Created TypeScript interfaces for Shopify data structures
- Implemented React hooks for data fetching and cart management
- Set up GraphQL code generation for type safety
- Created products listing page with pagination support
- Updated GraphQL queries to use proper template literals for code generation
- Created comprehensive integration plan in todo.md
- Implemented Shopify Admin API integration with authentication and client utilities
- Added GraphQL queries and mutations for Shopify Admin API

