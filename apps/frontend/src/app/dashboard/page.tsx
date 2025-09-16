'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient, ApiError } from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';

interface ApiResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [apiData, setApiData] = useState<{
    hello?: ApiResponse;
    health?: ApiResponse;
    protected?: ApiResponse;
    adminOnly?: ApiResponse;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [hello, health, protectedData, adminOnly] = await Promise.allSettled([
        apiClient.getHello(),
        apiClient.getHealth(),
        apiClient.getProtected(),
        apiClient.getAdminOnly().catch(() => null), // This might fail for non-admin users
      ]);

      setApiData({
        hello: hello.status === 'fulfilled' ? hello.value : null,
        health: health.status === 'fulfilled' ? health.value : null,
        protected: protectedData.status === 'fulfilled' ? protectedData.value : null,
        adminOnly: adminOnly.status === 'fulfilled' ? adminOnly.value : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">
                    Welcome back, {user?.firstName} {user?.lastName}!
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {user?.role}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile Settings
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Account Settings
                      </div>
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* API Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Hello Endpoint
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {apiData.hello ? 'Connected' : 'Failed'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🏥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Health Check</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {apiData.health ? 'Healthy' : 'Failed'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🔒</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Protected Route
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {apiData.protected ? 'Accessible' : 'Failed'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user?.role === 'ADMIN' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className="text-white text-sm">👑</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Admin Route</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {apiData.adminOnly
                            ? 'Accessible'
                            : user?.role === 'ADMIN'
                              ? 'Failed'
                              : 'No Access'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Response Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  API Response Details
                </h3>

                {loading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading API data...</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                    <button
                      onClick={fetchApiData}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {apiData.hello && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">Hello Endpoint</h4>
                      <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(apiData.hello, null, 2)}
                      </pre>
                    </div>
                  )}

                  {apiData.health && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">Health Check</h4>
                      <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(apiData.health, null, 2)}
                      </pre>
                    </div>
                  )}

                  {apiData.protected && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">Protected Route</h4>
                      <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(apiData.protected, null, 2)}
                      </pre>
                    </div>
                  )}

                  {apiData.adminOnly && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">Admin Only Route</h4>
                      <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(apiData.adminOnly, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={fetchApiData}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
