'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
        return;
      }
      
      if (requireAdmin && user?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">A</div>
            <h1 className="auth-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
