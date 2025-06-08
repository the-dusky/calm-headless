"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      const response = await fetch(`/api/cart/${cartId}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error fetching cart:', data.error);
        // Cart not found or expired, clear local storage
        localStorage.removeItem('cartId');
        setCart(null);
        return;
      }
      
      if (data?.cart) {
        setCart(data.cart);
      } else {
        // Cart not found or expired, clear local storage
        localStorage.removeItem('cartId');
        setCart(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Cart not found or expired, clear local storage
      localStorage.removeItem('cartId');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new cart
  const createCart = async (variantId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error creating cart:', data.error);
        return;
      }
      
      const newCart = data.cart;
      if (newCart) {
        localStorage.setItem('cartId', newCart.id);
        setCart(newCart);
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (variantId: string, quantity: number) => {
    try {
      setIsLoading(true);
      let cartId = localStorage.getItem('cartId');

      // If no cart exists, create one
      if (!cartId) {
        await createCart(variantId, quantity);
        return;
      }

      // Add to existing cart
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error adding to cart:', data.error);
        return;
      }
      
      const updatedCart = data.cart;
      if (updatedCart) {
        setCart(updatedCart);
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart
  const updateCartItem = async (lineId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const cartId = localStorage.getItem('cartId');

      if (!cartId) {
        console.error('No cart ID found');
        return;
      }

      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: [
            {
              id: lineId,
              quantity
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error updating cart:', data.error);
        return;
      }
      
      const updatedCart = data.cart;
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (lineId: string) => {
    try {
      setIsLoading(true);
      const cartId = localStorage.getItem('cartId');

      if (!cartId) {
        console.error('No cart ID found');
        return;
      }

      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineIds: [lineId]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error removing from cart:', data.error);
        return;
      }
      
      const updatedCart = data.cart;
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
    const cartId = localStorage.getItem('cartId');
    
    if (!cartId) {
      console.error('No cart ID found');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineIds
        })
      });
      
      const data = await response.json();

      if (!response.ok) {
        console.error('Error clearing cart:', data.error);
        return;
      }

      const updatedCart = data.cart;
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
