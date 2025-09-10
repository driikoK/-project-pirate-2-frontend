'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiService } from '@/services/api';
import { User, ApiError } from '@/types/api';

const UsersPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadPendingUsers();
    }
  }, [isAuthenticated, user]);

  const loadPendingUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await apiService.getPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load pending users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await apiService.approveUser(userId);
      setSuccess('User approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadPendingUsers(); // Reload the list
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to approve user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await apiService.rejectUser(userId);
      setSuccess('User rejected successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadPendingUsers(); // Reload the list
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to reject user');
      setTimeout(() => setError(''), 3000);
    }
  };



  const pendingCount = pendingUsers.filter(u => u.status === 'pending').length;

  return (
    <ProtectedRoute requireAdmin={true}>
      <DashboardLayout pendingCount={pendingCount}>
      {error && (
        <div className="alert alert-error show">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success show">
          {success}
        </div>
      )}

      <div className="users-grid">
        {isLoadingUsers ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            Loading users...
          </div>
        ) : pendingUsers.filter(u => u.status === 'pending').length > 0 ? (
          pendingUsers
            .filter(u => u.status === 'pending')
            .map((pendingUser) => (
              <div key={pendingUser.id} className="user-card">
                <div className="user-card-info">
                  <div className="user-card-avatar">
                    {pendingUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-card-details">
                    <h3>{pendingUser.email}</h3>
                    <p>Role: {pendingUser.role}</p>
                    <span className="status-badge status-pending">Pending</span>
                  </div>
                </div>
                <div className="user-actions">
                  <button
                    className="action-btn approve-btn"
                    onClick={() => approveUser(pendingUser.id)}
                  >
                    <i className="fas fa-check"></i> Approve
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => rejectUser(pendingUser.id)}
                  >
                    <i className="fas fa-times"></i> Reject
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-users"></i>
            <h3>No Pending Requests</h3>
            <p>All users have been processed</p>
          </div>
        )}
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UsersPage;
