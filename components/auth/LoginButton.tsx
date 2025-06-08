'use client';

import React from 'react';
import { useAuth } from './AuthProvider';

interface LoginButtonProps {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}

export default function LoginButton({ className, redirectTo, children }: LoginButtonProps) {
  const { login, isAuthenticated, isLoading } = useAuth();

  // Don't show the login button if the user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    login(redirectTo);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={className || 'inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900'}
    >
      {children || 'Sign In'}
    </button>
  );
}
