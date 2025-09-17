# Multi-Tenant SaaS Platform

A comprehensive multi-tenant SaaS platform built with modern technologies, featuring real-time collaboration, authentication, billing, and scalable infrastructure.

## 🚀 Features

### Authentication & Authorization

- SSO (Google, Microsoft, custom JWT-based)
- Role-based access control (RBAC) & attribute-based (ABAC)
- Multi-tenancy with tenant isolation

### Organization & User Management

- Workspaces (tenants) with org-level settings
- Teams & permissions
- User invitation system

### Collaboration Features

- Real-time document editing (WebSocket / WebRTC / CRDTs)
- Chat module (like Slack channels)
- Live cursors and presence

### Billing & Subscription

- Stripe integration for subscription plans (monthly/yearly)
- Usage metering (e.g., number of docs, messages, storage)

### Audit Logging & Monitoring

- User actions (GDPR-compliant)
- Request tracing with OpenTelemetry

## 🛠️ Technical Stack

### Frontend

- **React 18** + TypeScript
- **Next.js** (for SSR/SSG, SEO, and scaling)
- **Tailwind CSS** + **Radix UI** + **shadcn/ui**
- **Zustand** or **TanStack Query** for state & server cache
- **WebSockets/WebRTC** for real-time collaboration
- **Testing**: Playwright, Vitest, React Testing Library

### Backend

- **NestJS** + TypeScript
- **PostgreSQL** (multi-tenant schemas) + **Prisma ORM**
- **Redis** (caching + pub/sub for notifications)
- **Kafka** (event-driven microservices)
- **WebSockets** (socket.io)
- **GraphQL** (Apollo Federation) or **REST** (versioned)
- **Testing**: Jest + Pact (contract testing)

### DevOps & Infrastructure

- **Docker** & **Kubernetes** (Helm charts for deployment)
- **CI/CD** with GitHub Actions
- **Infrastructure as Code** (Terraform)
- **Monitoring**: Prometheus + Grafana, OpenTelemetry
- **API Gateway** (Kong/NGINX)
- **Cloud**: AWS (RDS, S3, EKS, CloudFront)

## 🏗️ Project Structure

```
multi-tenant-saas/
├── apps/
│   ├── frontend/          # Next.js React application
│   ├── backend/           # NestJS API server
│   └── frontend-e2e/      # End-to-end tests
├── libs/                  # Shared libraries (to be created)
│   ├── shared/           # Shared utilities and types
│   ├── auth/             # Authentication library
│   ├── billing/          # Billing and subscription logic
│   └── collaboration/    # Real-time collaboration features
├── docker-compose.yml    # Local development environment
├── Dockerfile           # Production backend image
├── Dockerfile.frontend  # Production frontend image
└── scripts/             # Database initialization scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd multi-tenant-saas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**

   ```bash
   # Start all services (PostgreSQL, Redis, Backend, Frontend)
   docker-compose up -d

   # Or start only the applications
   npm run dev
   ```

### Development Commands

```bash
# Start both frontend and backend in development mode
npm run dev

# Start individual services
npm run serve:frontend    # Start frontend only
npm run serve:backend     # Start backend only

# Build all applications
npm run build

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

### API Endpoints

- **Health Check**: `GET /api/v1/health`
- **Hello World**: `GET /api/v1/hello`

### Frontend URLs

- **Main App**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🐳 Docker Development

The project includes Docker Compose configuration for local development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Services

- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Backend API**: `localhost:3001`
- **Frontend**: `localhost:3000`

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run e2e

# Run tests for specific project
nx test frontend
nx test backend
```

## 📦 Building for Production

```bash
# Build all applications
npm run build

# Build specific application
nx build frontend
nx build backend
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `STRIPE_SECRET_KEY`: Stripe API key
- `NEXT_PUBLIC_API_URL`: Frontend API URL

### Database Setup

The application uses PostgreSQL with multi-tenant support:

1. **Main Database**: `multi_tenant_saas`
2. **Tenant Databases**: `tenant1`, `tenant2`, `tenant3` (configurable)

## 🚀 Deployment

### Docker Production

```bash
# Build production images
docker build -t multi-tenant-backend .
docker build -f Dockerfile.frontend -t multi-tenant-frontend .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Deploy with Helm
helm install multi-tenant-saas ./helm-chart
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commits
- Ensure all linting passes
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🗺️ Roadmap

### Milestone 1: Foundation Setup ✅

- [x] Monorepo structure (Nx) for React + NestJS
- [x] Configure TypeScript, ESLint, Prettier, Husky
- [x] Setup Docker & local dev environment (Postgres, Redis)
- [x] Hello World for React + NestJS communication

### Milestone 2: Authentication & Authorization (Next)

- [ ] JWT-based authentication
- [ ] Google OAuth integration
- [ ] Microsoft OAuth integration
- [ ] Role-based access control (RBAC)
- [ ] Multi-tenant user management

### Milestone 3: Database & Data Layer

- [ ] Prisma ORM setup
- [ ] Multi-tenant database schema
- [ ] User and organization models
- [ ] Database migrations

### Milestone 4: Real-time Collaboration

- [ ] WebSocket integration
- [ ] Real-time document editing
- [ ] Chat functionality
- [ ] Live presence indicators

### Milestone 5: Billing & Subscriptions

- [ ] Stripe integration
- [ ] Subscription management
- [ ] Usage metering
- [ ] Payment processing

---

**Built with ❤️ for scalable multi-tenant SaaS applications**
