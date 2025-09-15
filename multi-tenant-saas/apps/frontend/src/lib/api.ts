const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-storage');
      if (token) {
        try {
          const authData = JSON.parse(token);
          if (authData.state?.accessToken) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${authData.state.accessToken}`,
            };
          }
        } catch (error) {
          console.warn('Failed to parse auth token from localStorage');
        }
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error instanceof Error ? error.message : 'An unknown error occurred', 0);
    }
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
    return this.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signIn(data: { email: string; password: string }) {
    return this.request('/api/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string) {
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logoutAll() {
    return this.request('/api/v1/auth/logout-all', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/api/v1/auth/profile');
  }

  async verifyToken() {
    return this.request('/api/v1/auth/verify');
  }

  // General endpoints
  async getHealth() {
    return this.request('/api/v1/health');
  }

  async getHello() {
    return this.request('/api/v1/hello');
  }

  async getProtected() {
    return this.request('/api/v1/protected');
  }

  async getAdminOnly() {
    return this.request('/api/v1/admin-only');
  }
}

export const apiClient = new ApiClient();

