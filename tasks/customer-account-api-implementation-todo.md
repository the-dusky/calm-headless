# Customer Account API Implementation Todo

## Overview

This document outlines the specific tasks needed to implement customer account management using Shopify's Customer Account API in our Next.js application. This implementation will replace our previous approach using the Storefront API.

## Current Status

- [x] Researched Shopify Customer Account API vs Storefront API
- [x] Created high-level implementation plan
- [x] Set up OAuth2 configuration with Shopify
- [x] Implemented core authentication components and flows
- [x] Fixed TypeScript errors and build issues
- [ ] Test and debug the authentication flow

## Implementation Tasks

### Phase 1: Setup and Configuration

1. [x] Set up OAuth configuration in Shopify
   - [x] Go to Shopify admin → Headless app/channel → Customer Account API → Application setup
   - [x] Copy Customer Account API credentials
   - [x] Configure callback URIs, JavaScript origins, and logout URI

2. [x] Set up environment variables
   - [x] Add `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID`
   - [x] Add `SHOPIFY_CUSTOMER_ACCOUNT_API_URL`
   - [x] Add `SHOPIFY_CUSTOMER_API_VERSION` (currently 2024-01)
   - [x] Add `SHOPIFY_ORIGIN_URL` for production

3. [x] Create authentication utility functions
   - [x] Create function to generate authorization URL
   - [x] Create function to handle token exchange
   - [x] Create function to refresh tokens
   - [x] Create function to revoke tokens on logout

### Phase 2: Backend Implementation

1. [x] Create server actions for OAuth flow
   - [x] Implement `initiateLogin` function to redirect to Shopify's login page
   - [x] Create `handleAuthCallback` function to exchange code for tokens
   - [x] Implement `refreshToken` function for token renewal
   - [x] Create `logout` function to revoke tokens

2. [x] Create API routes
   - [x] Create `/api/auth/login` route to initiate login
   - [x] Create `/authorize` route to handle OAuth callback
   - [x] Create `/api/auth/logout` route to handle logout
   - [x] Create `/api/auth/customer` route to fetch customer data

3. [x] Implement secure token storage
   - [x] Set up HTTP-only cookies for storing tokens
   - [x] Add cookie expiration and secure flags
   - [x] Implement proper error handling

4. [x] Create customer data API functions
   - [x] Implement function to fetch customer profile
   - [x] Create function to update customer profile
   - [x] Implement function to fetch order history
   - [x] Create functions for address management

### Phase 3: Frontend Implementation

1. [x] Create authentication context provider
   - [x] Implement context for managing authentication state
   - [x] Add loading and error states
   - [x] Create functions to check authentication status
   - [x] Add user profile state management

2. [x] Build authentication UI components
   - [x] Create login button component
   - [x] Implement OAuth callback handling
   - [x] Add logout button component
   - [x] Integrate auth components into navigation

3. [ ] Create account pages
   - [x] Build basic account dashboard page
   - [ ] Create profile management page
   - [ ] Implement order history page
   - [ ] Add address book management page

### Phase 4: Testing and Refinement

1. [ ] Test authentication flow
   - [ ] Verify login process
   - [ ] Test token refresh
   - [ ] Validate logout functionality

2. [ ] Test account management
   - [ ] Verify profile updates
   - [ ] Test order history viewing
   - [ ] Validate address management

3. [ ] Security testing
   - [ ] Verify token storage security
   - [ ] Validate authorization checks

## Next Steps

1. Test the OAuth flow with Shopify (requires HTTPS URL)
2. Complete the account management pages (profile, orders, addresses)
3. Add error handling and edge cases
4. Implement additional security measures if needed

## Resources

- [Customer Account API Documentation](https://shopify.dev/docs/api/customer)
- [OAuth 2.0 for Shopify](https://shopify.dev/docs/apps/auth/oauth)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Context API](https://reactjs.org/docs/context.html)

## Review - June 7, 2025

### Completed Implementation

We've successfully implemented the core functionality for the Shopify Customer Account API integration:

1. **Authentication Flow**
   - OAuth2 implementation with secure token storage
   - Proper async/await handling for cookie operations
   - Token refresh mechanism for maintaining sessions
   - Secure logout with token revocation

2. **Backend Infrastructure**
   - GraphQL client for Customer Account API
   - Server actions for authentication operations
   - API routes for handling auth flows and customer data
   - HTTP-only cookie storage for tokens

3. **Frontend Components**
   - AuthProvider context for global auth state
   - Login/logout UI components in navigation
   - Protected account page with customer profile
   - Login page with redirect handling

### Fixed Issues

- TypeScript errors in auth implementation
   - Fixed async/await usage in getAccessToken function
   - Properly awaited cookies() calls in token storage functions
- Async/await inconsistencies in cookie handling
- Build errors with dynamic routes
   - Added route.config.js with force-dynamic setting
- Client-side component suspense boundaries
   - Wrapped useSearchParams in Suspense boundary

### Next Steps

1. **Testing**
   - Configure Shopify app with correct callback URIs
   - Test the full OAuth flow with real credentials
   - Verify token refresh works correctly
   - Test error scenarios and recovery

2. **Account Management**
   - Complete the account overview page
   - Implement order history functionality
   - Add address book management
   - Create profile editing capabilities

3. **Integration with Cart**
   - Connect authenticated customer to cart
   - Enable saved addresses in checkout
   - Support order history tracking
