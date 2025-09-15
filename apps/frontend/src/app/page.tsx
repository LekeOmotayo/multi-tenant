'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import styles from './page.module.css';

interface BackendResponse {
  message: string;
  timestamp: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export default function Index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [backendMessage, setBackendMessage] = useState<BackendResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const fetchBackendData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Fetch hello message
      const helloResponse = await fetch(`${apiUrl}/api/v1/hello`);
      if (!helloResponse.ok) throw new Error('Failed to fetch hello message');
      const helloData = await helloResponse.json();
      setBackendMessage(helloData);

      // Fetch health status
      const healthResponse = await fetch(`${apiUrl}/api/v1/health`);
      if (!healthResponse.ok) throw new Error('Failed to fetch health status');
      const healthData = await healthResponse.json();
      setHealthStatus(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome to Multi-Tenant SaaS! 🚀
            </h1>
          </div>

          <div id="hero" className="rounded">
            <div className="text-container">
              <h2>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Frontend ↔ Backend Communication</span>
              </h2>
              <p>Real-time communication between React frontend and NestJS backend</p>
            </div>
          </div>

          {/* Authentication Section */}
          <div id="auth-section" className="rounded shadow">
            <h2>🔐 Authentication Ready</h2>
            <div className="auth-actions">
              <a
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </a>
              <a
                href="/auth/signup"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-3"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Backend Communication Section */}
          <div id="backend-communication" className="rounded shadow">
            <h2>Backend Status</h2>

            {loading && (
              <div className="loading">
                <p>🔄 Connecting to backend...</p>
              </div>
            )}

            {error && (
              <div className="error">
                <p>❌ Error: {error}</p>
                <button onClick={fetchBackendData} className="retry-button">
                  Retry Connection
                </button>
              </div>
            )}

            {backendMessage && (
              <div className="success">
                <h3>✅ Backend Response</h3>
                <p>
                  <strong>Message:</strong> {backendMessage.message}
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date(backendMessage.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            {healthStatus && (
              <div className="health-status">
                <h3>🏥 Health Check</h3>
                <p>
                  <strong>Status:</strong> <span className="status-ok">{healthStatus.status}</span>
                </p>
                <p>
                  <strong>Uptime:</strong> {Math.floor(healthStatus.uptime)} seconds
                </p>
                <p>
                  <strong>Last Check:</strong> {new Date(healthStatus.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            <div className="actions">
              <button onClick={fetchBackendData} disabled={loading} className="refresh-button">
                {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
              </button>
            </div>
          </div>

          <div id="features" className="rounded shadow">
            <h2>🚀 Multi-Tenant SaaS Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🔐 Authentication & Authorization</h3>
                <ul>
                  <li>JWT-based authentication (access + refresh tokens)</li>
                  <li>Password hashing with bcrypt</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>Multi-tenancy with tenant isolation</li>
                </ul>
              </div>

              <div className="feature-card">
                <h3>👥 Organization & User Management</h3>
                <ul>
                  <li>Workspaces (tenants) with org-level settings</li>
                  <li>Teams & permissions</li>
                  <li>User invitation system</li>
                </ul>
              </div>

              <div className="feature-card">
                <h3>🤝 Real-time Collaboration</h3>
                <ul>
                  <li>Real-time document editing (WebSocket)</li>
                  <li>Chat module (like Slack channels)</li>
                  <li>Live cursors and presence</li>
                </ul>
              </div>

              <div className="feature-card">
                <h3>💳 Billing & Subscription</h3>
                <ul>
                  <li>Stripe integration</li>
                  <li>Monthly/yearly subscription plans</li>
                  <li>Usage metering</li>
                </ul>
              </div>
            </div>
          </div>

          <div id="tech-stack" className="rounded shadow">
            <h2>🛠️ Technical Stack</h2>
            <div className="tech-grid">
              <div className="tech-section">
                <h3>Frontend</h3>
                <ul>
                  <li>React 19 + TypeScript</li>
                  <li>Next.js (SSR/SSG)</li>
                  <li>Tailwind + Radix UI + shadcn/ui</li>
                  <li>Zustand + TanStack Query</li>
                  <li>WebSockets for real-time</li>
                </ul>
              </div>

              <div className="tech-section">
                <h3>Backend</h3>
                <ul>
                  <li>NestJS + TypeScript</li>
                  <li>PostgreSQL + Prisma ORM</li>
                  <li>Redis (caching + pub/sub)</li>
                  <li>Kafka (event-driven microservices)</li>
                  <li>WebSockets (socket.io)</li>
                </ul>
              </div>

              <div className="tech-section">
                <h3>DevOps & Infrastructure</h3>
                <ul>
                  <li>Docker & Kubernetes</li>
                  <li>CI/CD with GitHub Actions</li>
                  <li>Infrastructure as Code (Terraform)</li>
                  <li>Monitoring: Prometheus + Grafana</li>
                  <li>Cloud: AWS (RDS, S3, EKS)</li>
                </ul>
              </div>
            </div>
          </div>

          <p id="love">Built with ❤️ for scalable multi-tenant SaaS applications</p>
        </div>
      </div>
    </div>
  );
}
