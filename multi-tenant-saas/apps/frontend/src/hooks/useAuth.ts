import { useCallback } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { apiClient, ApiError } from '../lib/api';

export const useAuth = () => {
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      clearError();

      try {
        const response = await apiClient.signIn({ email, password });
        login(response.user, response.accessToken, response.refreshToken);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof ApiError ? error.message : 'An error occurred during sign in';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, setError, clearError]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role?: 'ADMIN' | 'MEMBER' | 'VIEWER',
      tenantId?: string
    ) => {
      setLoading(true);
      clearError();

      try {
        const response = await apiClient.signUp({
          email,
          password,
          firstName,
          lastName,
          role,
          tenantId,
        });
        login(response.user, response.accessToken, response.refreshToken);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof ApiError ? error.message : 'An error occurred during sign up';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, setError, clearError]
  );

  const signOut = useCallback(async () => {
    if (refreshToken) {
      try {
        await apiClient.logout(refreshToken);
      } catch (error) {
        console.warn('Failed to logout on server:', error);
      }
    }
    logout();
  }, [refreshToken, logout]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.refreshToken(refreshToken);
      useAuthStore.getState().setTokens(response.accessToken, refreshToken);
      return response.accessToken;
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  }, [refreshToken, logout]);

  const verifyAuth = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      return false;
    }

    try {
      await apiClient.verifyToken();
      return true;
    } catch (error) {
      // Try to refresh token
      try {
        await refreshAccessToken();
        return true;
      } catch (refreshError) {
        logout();
        return false;
      }
    }
  }, [isAuthenticated, accessToken, refreshAccessToken, logout]);

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    signIn,
    signUp,
    signOut,
    refreshAccessToken,
    verifyAuth,
    clearError,
  };
};

