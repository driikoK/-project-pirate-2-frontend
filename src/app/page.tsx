'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInPage from '@/components/auth/SignInPage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

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
    return <SignInPage />;
  }

  return null; // Will redirect to dashboard
}
