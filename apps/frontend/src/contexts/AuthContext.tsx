'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { showToast } = useToast();

  // Show success/error toasts based on auth state
  useEffect(() => {
    if (auth.error) {
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: auth.error,
        duration: 5000,
      });
    }
  }, [auth.error, showToast]);

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn(email, password);
      showToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been successfully signed in.',
        duration: 3000,
      });
    } catch (error) {
      // Error is handled by the auth hook and useEffect above
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => {
    try {
      await auth.signUp(email, password, firstName, lastName, role);
      showToast({
        type: 'success',
        title: 'Account created!',
        message: 'Welcome to our platform. Your account has been created successfully.',
        duration: 3000,
      });
    } catch (error) {
      // Error is handled by the auth hook and useEffect above
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      showToast({
        type: 'info',
        title: 'Signed out',
        message: 'You have been successfully signed out.',
        duration: 3000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Sign out error',
        message: 'There was an error signing you out.',
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
