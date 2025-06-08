'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CustomerData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  displayName?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  customer: CustomerData | null;
  error: string | null;
  login: (redirectTo?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Make a request to get the customer data
        const response = await fetch('/api/auth/customer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCustomer(data.customer);
          setIsAuthenticated(true);
          setError(null);
        } else {
          setIsAuthenticated(false);
          setCustomer(null);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setIsAuthenticated(false);
        setCustomer(null);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (redirectTo?: string) => {
    const url = new URL('/api/auth/login', window.location.origin);
    if (redirectTo) {
      url.searchParams.append('redirectTo', redirectTo);
    }
    window.location.href = url.toString();
  };

  // Logout function
  const logout = async () => {
    try {
      window.location.href = '/api/auth/logout';
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out');
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    customer,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
