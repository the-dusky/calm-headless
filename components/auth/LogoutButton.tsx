'use client';

import React from 'react';
import { useAuth } from './AuthProvider';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const { logout, isAuthenticated, isLoading } = useAuth();

  // Don't show the logout button if the user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className || 'inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900'}
    >
      {children || 'Sign Out'}
    </button>
  );
}
