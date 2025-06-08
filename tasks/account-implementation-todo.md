# Account Management Implementation Todo

## Current Progress
- ✅ Defined GraphQL queries and mutations for customer authentication and account management
- 🔄 Creating server actions for customer authentication

## Next Steps

1. Create customer-related types in `lib/shopify/types.ts`
   - Add types for customer data
   - Add types for authentication responses
   - Add types for address management

2. Create server actions in `lib/shopify/customer-actions.ts`
   - Implement loginCustomer function
   - Implement registerCustomer function
   - Implement getCustomerData function
   - Implement updateCustomerProfile function
   - Implement requestPasswordReset function
   - Implement resetPassword function
   - Implement address management functions

3. Create API routes for client-side access
   - Create `/api/account/login` endpoint
   - Create `/api/account/register` endpoint
   - Create `/api/account/profile` endpoint
   - Create `/api/account/password-reset` endpoint
   - Create `/api/account/addresses` endpoints
   - Create `/api/account/orders` endpoints

4. Create customer authentication context
   - Implement customer state management
   - Add login/logout functionality
   - Implement token storage and renewal
   - Add authentication status checks

5. Create UI components and pages
   - Create login page and form
   - Create registration page and form
   - Create account dashboard page
   - Create profile management page
   - Create order history page
   - Create address management page

## Testing Plan
- Test authentication flow (login, register, password reset)
- Test profile management
- Test order history viewing
- Test address management
- Test token renewal and session persistence

## Security Checklist
- Ensure tokens are stored securely (HTTP-only cookies)
- Implement CSRF protection
- Add input validation
- Implement rate limiting for authentication attempts
- Use secure headers
