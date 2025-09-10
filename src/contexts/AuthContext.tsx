'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SignInDto, SignUpDto } from '@/types/api';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInDto) => Promise<void>;
  signUp: (userData: SignUpDto) => Promise<void>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const profile = await apiService.getUserProfile();
          setUser(profile);
        }
      } catch {
        // Token might be invalid, clear it
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (credentials: SignInDto) => {
    try {
      const response = await apiService.signIn(credentials);
      localStorage.setItem('access_token', response.access_token);
      
      // Get full user profile
      const profile = await apiService.getUserProfile();
      setUser(profile);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData: SignUpDto) => {
    try {
      await apiService.signUp(userData);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
