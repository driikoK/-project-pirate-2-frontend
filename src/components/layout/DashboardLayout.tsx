'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  pendingCount?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  pendingCount = 0 
}) => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">A</div>
          <h3 className="sidebar-title">Analytics</h3>
        </div>
        <div className="sidebar-nav">
          <Link 
            href="/dashboard" 
            className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
          >
            <i className="fas fa-chart-line"></i>
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link 
              href="/users" 
              className={`nav-item ${pathname === '/users' ? 'active' : ''}`}
            >
              <i className="fas fa-users-cog"></i>
              User Management
              {pendingCount > 0 && (
                <span className="nav-badge">{pendingCount}</span>
              )}
            </Link>
          )}
        </div>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.role === 'admin' ? 'Admin' : 'User'}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={signOut}>
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </nav>
      <main className="main-content">
        <div className="main-header">
          <div className="logo-section">
            <Image 
              src="/propel_white-192w.webp" 
              alt="Propel Logo" 
              width={192}
              height={60}
              className="main-logo"
              priority
            />
            <div className="partner-logo-placeholder">
              <i className="fas fa-image"></i>
              <span>Client Logo</span>
            </div>
          </div>
        </div>
        <div className="main-body">
          <div className="container">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
