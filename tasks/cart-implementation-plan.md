# Cart Implementation Plan

## Overview
Implement a complete cart system that integrates with Shopify's Storefront API, allowing users to add products, manage quantities, and proceed to checkout.

## Components

### 1. Cart Context/Provider
- Create a React context to manage cart state globally
- Implement cart operations (add, update, remove)
- Store cart ID in local storage for persistence
- Connect to Shopify Storefront API for cart operations

### 2. Cart UI Components
- Design a cart drawer/sidebar that slides in from the right
- Create cart line item component with product details, quantity controls, and remove button
- Implement empty cart state UI
- Add cart summary with subtotal, discounts, and checkout button

### 3. Product-to-Cart Integration
- Add "Add to Cart" buttons on product cards
- Implement variant selection on product detail pages
- Show cart feedback (animation, toast notification) when products are added
- Update cart icon with item count

### 4. Cart Operations
- Create cart on first item add if no cart exists
- Update line item quantities
- Remove items from cart
- Apply discount codes
- Calculate totals

## Implementation Steps

1. **Set up Cart Context**
   - Create cart context and provider
   - Implement local storage persistence
   - Add cart mutation hooks

2. **Build Cart UI**
   - Create cart drawer/sidebar component
   - Implement cart toggle button in header
   - Design cart line item components
   - Add cart summary and checkout button

3. **Add Product-to-Cart Functionality**
   - Update product detail page with "Add to Cart" functionality
   - Add quantity selector
   - Implement variant selection
   - Add feedback for successful cart additions

4. **Cart Management**
   - Implement quantity update controls
   - Add remove item functionality
   - Create cart summary calculations
   - Add discount code input

5. **Testing**
   - Test cart persistence across page refreshes
   - Verify cart operations work correctly
   - Test on different devices and browsers
   - Check edge cases (adding same product multiple times, etc.)

## GraphQL Operations Needed

- `cartCreate`: Create a new cart
- `cartLinesAdd`: Add items to cart
- `cartLinesUpdate`: Update cart line quantities
- `cartLinesRemove`: Remove items from cart
- `cartDiscountCodesApply`: Apply discount codes
- `cartDiscountCodesRemove`: Remove discount codes
- `cartQuery`: Fetch cart details

## Next Steps After Implementation
- Connect cart to checkout process
- Integrate with calendar-based shipping UI
