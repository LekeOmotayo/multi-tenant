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
      const [hello, health, protected, adminOnly] = await Promise.allSettled([
        apiClient.getHello(),
        apiClient.getHealth(),
        apiClient.getProtected(),
        apiClient.getAdminOnly().catch(() => null), // This might fail for non-admin users
      ]);

      setApiData({
        hello: hello.status === 'fulfilled' ? hello.value : null,
        health: health.status === 'fulfilled' ? health.value : null,
        protected: protected.status === 'fulfilled' ? protected.value : null,
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
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {user?.firstName} {user?.lastName}!
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <p>
                    Role: <span className="font-medium">{user?.role}</span>
                  </p>
                  <p>
                    Email: <span className="font-medium">{user?.email}</span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
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

