"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shopifyFetch } from '@/lib/shopify/client';
import { 
  CREATE_CART, 
  ADD_TO_CART, 
  UPDATE_CART, 
  REMOVE_FROM_CART,
  GET_CART
} from '@/lib/shopify/queries';
import { DocumentNode } from 'graphql';

// Types
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      images: {
        edges: {
          node: {
            url: string;
            altText: string | null;
          }
        }[]
      }
    }
    price: {
      amount: string;
      currencyCode: string;
    }
  }
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: CartLine
    }[]
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    }
    totalAmount: {
      amount: string;
      currencyCode: string;
    }
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    }
  }
}

interface CartContextType {
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  cartCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate cart count
  const cartCount = cart?.lines.edges.reduce((total, { node }) => {
    return total + node.quantity;
  }, 0) || 0;

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      fetchCart(cartId);
    }
  }, []);

  // Fetch cart data
  const fetchCart = async (cartId: string) => {
    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: GET_CART.loc?.source.body || '',
        variables: { cartId }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error fetching cart:', errors);
        return;
      }

      if (data?.data?.cart) {
        setCart(data.data.cart);
      } else {
        // Cart not found or expired, clear local storage
        localStorage.removeItem('cartId');
        setCart(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new cart
  const createCart = async (variantId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: CREATE_CART.loc?.source.body || '',
        variables: {
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error creating cart:', errors);
        return;
      }

      const newCart = data?.data?.cartCreate?.cart;
      if (newCart) {
        localStorage.setItem('cartId', newCart.id);
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (variantId: string, quantity: number) => {
    if (!cart) {
      await createCart(variantId, quantity);
      return;
    }

    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: ADD_TO_CART.loc?.source.body || '',
        variables: {
          cartId: cart.id,
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error adding to cart:', errors);
        return;
      }

      const updatedCart = data?.data?.cartLinesAdd?.cart;
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: UPDATE_CART.loc?.source.body || '',
        variables: {
          cartId: cart.id,
          lines: [
            {
              id: lineId,
              quantity
            }
          ]
        }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error updating cart:', errors);
        return;
      }

      const updatedCart = data?.data?.cartLinesUpdate?.cart;
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (lineId: string) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: REMOVE_FROM_CART.loc?.source.body || '',
        variables: {
          cartId: cart.id,
          lineIds: [lineId]
        }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error removing from cart:', errors);
        return;
      }

      const updatedCart = data?.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart (remove all items)
  const clearCart = async () => {
    if (!cart) return;

    const lineIds = cart.lines.edges.map(({ node }) => node.id);
    
    try {
      setIsLoading(true);
      const response = await shopifyFetch({
        query: REMOVE_FROM_CART.loc?.source.body || '',
        variables: {
          cartId: cart.id,
          lineIds
        }
      });

      const { body } = response;
      const data = body as any;
      const errors = data.errors;

      if (errors) {
        console.error('Error clearing cart:', errors);
        return;
      }

      const updatedCart = data?.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart visibility functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        cartCount,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
