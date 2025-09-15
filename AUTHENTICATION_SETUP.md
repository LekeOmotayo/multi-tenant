# Authentication & Authorization Setup

## Milestone 2: Authentication & Authorization Implementation

This document outlines the complete authentication and authorization system implemented for the Multi-Tenant SaaS application.

## ✅ Backend Implementation

### Features Implemented

1. **JWT-based Authentication**
   - Access tokens (15 minutes expiry)
   - Refresh tokens (7 days expiry)
   - Secure token storage in database

2. **Password Security**
   - bcrypt hashing with salt rounds (12)
   - Password validation and strength requirements

3. **Role-based Access Control (RBAC)**
   - Three user roles: ADMIN, MEMBER, VIEWER
   - Role-based route protection
   - Custom decorators for role requirements

4. **Database Schema**
   - User entity with roles and status
   - Refresh token management
   - Tenant support for multi-tenancy

### Backend Structure

```
apps/backend/src/
├── auth/
│   ├── auth.module.ts          # Main auth module
│   ├── auth.controller.ts      # Auth endpoints
│   ├── auth.service.ts         # Business logic
│   ├── dto/
│   │   └── auth.dto.ts         # Request/response DTOs
│   ├── guards/
│   │   ├── jwt-auth.guard.ts   # JWT authentication guard
│   │   └── roles.guard.ts      # Role-based authorization guard
│   ├── strategies/
│   │   └── jwt.strategy.ts     # Passport JWT strategy
│   └── decorators/
│       ├── public.decorator.ts # Public route decorator
│       ├── roles.decorator.ts  # Role requirement decorator
│       └── current-user.decorator.ts # Current user decorator
├── prisma/
│   ├── prisma.service.ts       # Prisma client service
│   └── schema.prisma           # Database schema
└── app/
    ├── app.module.ts           # Main app module
    └── app.controller.ts       # Test endpoints
```

### API Endpoints

#### Authentication Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (invalidate refresh token)
- `POST /api/v1/auth/logout-all` - Logout from all devices
- `GET /api/v1/auth/profile` - Get user profile
- `GET /api/v1/auth/verify` - Verify token validity

#### Test Endpoints

- `GET /api/v1/health` - Health check (public)
- `GET /api/v1/hello` - Hello message (public)
- `GET /api/v1/protected` - Protected route (requires auth)
- `GET /api/v1/admin-only` - Admin-only route (requires ADMIN role)

## ✅ Frontend Implementation

### Features Implemented

1. **State Management**
   - Zustand store for authentication state
   - Persistent storage with localStorage
   - Type-safe state management

2. **API Client**
   - Centralized API client with error handling
   - Automatic token attachment to requests
   - Token refresh logic

3. **Authentication Pages**
   - Sign in page with form validation
   - Sign up page with role selection
   - Responsive design with Tailwind CSS

4. **Protected Routes**
   - Route protection wrapper component
   - Role-based access control
   - Automatic redirects for unauthorized access

5. **Dashboard**
   - Protected dashboard with user information
   - API testing interface
   - Real-time authentication status

### Frontend Structure

```
apps/frontend/src/
├── stores/
│   └── auth.store.ts           # Zustand authentication store
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── lib/
│   └── api.ts                  # API client
├── components/
│   └── ProtectedRoute.tsx      # Route protection component
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx        # Sign in page
│   │   └── signup/
│   │       └── page.tsx        # Sign up page
│   ├── dashboard/
│   │   └── page.tsx            # Protected dashboard
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Root layout
└── global.css                  # Global styles
```

## 🚀 Setup Instructions

### Prerequisites

1. **Database Setup**

   ```bash
   # Install PostgreSQL and create database
   createdb multi_tenant_saas
   ```

2. **Environment Variables**
   Create `.env` file in `apps/backend/`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/multi_tenant_saas?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   CORS_ORIGIN="http://localhost:3000"
   ```

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd apps/backend
   npm install
   ```

2. **Database Migration**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Backend**
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd apps/frontend
   npm install
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

## 🧪 Testing the Authentication Flow

### 1. User Registration

1. Navigate to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the registration form
4. Select a role (ADMIN, MEMBER, or VIEWER)
5. Submit the form

### 2. User Login

1. Navigate to `http://localhost:3000/auth/signin`
2. Enter email and password
3. Click "Sign In"
4. You should be redirected to the dashboard

### 3. Protected Routes

1. Try accessing `http://localhost:3000/dashboard` without authentication
2. You should be redirected to the sign-in page
3. After logging in, you should be able to access the dashboard

### 4. Role-based Access

1. Create users with different roles
2. Test admin-only functionality
3. Verify that non-admin users cannot access admin routes

### 5. API Testing

1. Use the dashboard to test different API endpoints
2. Verify that protected endpoints require authentication
3. Test token refresh functionality

## 🔐 Security Features

### Backend Security

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with expiration
- Refresh token rotation
- Role-based access control
- Input validation with class-validator
- CORS configuration

### Frontend Security

- Secure token storage in localStorage
- Automatic token refresh
- Route protection
- XSS protection with proper escaping
- CSRF protection through same-origin policy

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  status TEXT NOT NULL DEFAULT 'PENDING',
  tenantId TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  lastLoginAt TIMESTAMP
);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  userId TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🎯 Next Steps

The authentication and authorization system is now complete and ready for production use. Future enhancements could include:

1. **Social Authentication** - Google, Microsoft, GitHub OAuth
2. **Two-Factor Authentication** - TOTP, SMS, Email verification
3. **Password Reset** - Email-based password reset flow
4. **Account Verification** - Email verification for new accounts
5. **Session Management** - Advanced session tracking and management
6. **Audit Logging** - Authentication event logging
7. **Rate Limiting** - Login attempt rate limiting
8. **Password Policies** - Advanced password requirements

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Run `npx prisma db push` to create tables

2. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env
   - Check that frontend is running on correct port

3. **Token Errors**
   - Check JWT_SECRET is set in backend .env
   - Verify token expiration settings

4. **Role Access Issues**
   - Verify user role in database
   - Check role-based route protection

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend .env file.

## 📝 API Documentation

### Request/Response Examples

#### Sign Up Request

```json
POST /api/v1/auth/signup
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MEMBER"
}
```

#### Sign Up Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MEMBER",
    "tenantId": null
  }
}
```

#### Sign In Request

```json
POST /api/v1/auth/signin
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Protected Route Request

```http
GET /api/v1/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This completes the implementation of Milestone 2: Authentication & Authorization for the Multi-Tenant SaaS application.
