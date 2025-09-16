// Mock API client for development when backend is not available
export class MockApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.mockRequest<T>(endpoint, options);
  }

  private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock responses based on endpoint
    switch (endpoint) {
      case '/v1/auth/signup':
        if (options.method === 'POST') {
          const body = JSON.parse(options.body as string);
          return {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            user: {
              id: 'mock-user-id-' + Date.now(),
              email: body.email,
              firstName: body.firstName,
              lastName: body.lastName,
              role: body.role || 'MEMBER',
              tenantId: body.tenantId || undefined,
            },
          } as T;
        }
        break;

      case '/v1/auth/signin':
        if (options.method === 'POST') {
          const body = JSON.parse(options.body as string);
          return {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            user: {
              id: 'mock-user-id-' + Date.now(),
              email: body.email,
              firstName: 'Mock',
              lastName: 'User',
              role: 'MEMBER',
              tenantId: undefined,
            },
          } as T;
        }
        break;

      case '/v1/auth/refresh':
        if (options.method === 'POST') {
          return {
            accessToken: 'mock-refreshed-access-token-' + Date.now(),
          } as T;
        }
        break;

      case '/v1/auth/logout':
        if (options.method === 'POST') {
          return { message: 'Logged out successfully' } as T;
        }
        break;

      case '/v1/auth/logout-all':
        if (options.method === 'POST') {
          return { message: 'Logged out from all devices' } as T;
        }
        break;

      case '/v1/auth/profile':
        return {
          id: 'mock-user-id',
          email: 'mock@example.com',
          firstName: 'Mock',
          lastName: 'User',
          role: 'MEMBER',
          tenantId: null,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        } as T;

      case '/v1/auth/verify':
        return {
          valid: true,
          user: { id: 'mock-user-id', email: 'mock@example.com', role: 'MEMBER' },
        } as T;

      case '/v1/health':
        return { status: 'ok', timestamp: new Date().toISOString() } as T;

      case '/v1/hello':
        return { message: 'Hello from mock API!' } as T;

      default:
        throw new Error(`Mock endpoint not found: ${endpoint}`);
    }

    throw new Error(`Mock request failed for ${endpoint}`);
  }

  // Auth endpoints
  async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'ADMIN' | 'MEMBER' | 'VIEWER';
    tenantId?: string;
  }) {
    return this.mockRequest('/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signIn(data: { email: string; password: string }) {
    return this.mockRequest('/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.mockRequest('/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string) {
    return this.mockRequest('/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logoutAll() {
    return this.mockRequest('/v1/auth/logout-all', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.mockRequest('/v1/auth/profile');
  }

  async verifyToken() {
    return this.mockRequest('/v1/auth/verify');
  }

  // General endpoints
  async getHealth() {
    return this.mockRequest('/v1/health');
  }

  async getHello() {
    return this.mockRequest('/v1/hello');
  }

  async getProtected() {
    return this.mockRequest('/v1/protected');
  }

  async getAdminOnly() {
    return this.mockRequest('/v1/admin-only');
  }
}

export const mockApiClient = new MockApiClient();
