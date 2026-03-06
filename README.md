# OTT Platform

A modern, secure, and production-ready Over-The-Top (OTT) video streaming platform built with enterprise-grade architecture. This platform provides adaptive video streaming, secure user management, subscription handling, and comprehensive content management capabilities.

## ✨ Features

### Core Functionality
- **Video Streaming**: Adaptive bitrate streaming with HLS/DASH support
- **User Management**: Secure authentication with JWT, profiles, and role-based access
- **Subscription System**: Flexible subscription plans with payment integration
- **Content Management**: Video upload, encoding, and metadata management
- **Analytics**: Viewing analytics and user engagement metrics
- **Responsive UI**: Modern web interface built with Next.js and Tailwind CSS

### Security & Infrastructure
- **Enterprise Security**: BCrypt password hashing, JWT with refresh tokens, XSS/SQL injection protection
- **Database Optimization**: Connection pooling, automatic timestamps, cascade relationships
- **Health Monitoring**: Real-time database health checks, connection pool monitoring
- **Production-Ready**: HTTPS/TLS 1.2+, security headers, rate limiting, CORS protection
- **Containerization**: Docker & Docker Compose with all required services (PostgreSQL, Redis, Celery, Flower, Nginx)
- **CI/CD Ready**: GitHub Actions workflow for automated testing and deployment

## Tech Stack

### Backend (Python)
- **Framework**: FastAPI 0.104.1 with async support
- **Database**: PostgreSQL 15 with SQLAlchemy 2.0 ORM
- **Authentication**: JWT tokens with refresh mechanism, BCrypt hashing (12 rounds)
- **Data Validation**: Pydantic 2.4 with custom validators
- **Background Tasks**: Celery 5.3.4 with Redis broker
- **Task Monitoring**: Flower 2.0.1 web interface
- **Caching**: Redis 7 for session and cache management
- **Security**: Input validation, XSS/SQL injection prevention, rate limiting

### Frontend (TypeScript)
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: Zustand for global state
- **HTTP Client**: Axios with request/response interceptors
- **Type Safety**: Full TypeScript type coverage

### Infrastructure
- **Reverse Proxy**: Nginx 1.25 with SSL/TLS 1.2+, security headers, rate limiting
- **Containerization**: Docker & Docker Compose
- **Networking**: Isolated Docker networks for service communication
- **SSL/TLS**: Let's Encrypt certificate generation and auto-renewal
- **Monitoring**: Health check endpoints and connection pool metrics
- **CI/CD**: GitHub Actions for automated testing and deployment

## Project Structure

```
ott-platform/
├── backend/                 # FastAPI backend application
│   ├── app/                # Main application code
│   │   ├── api/           # API routes
│   │   ├── core/          # Core functionality
│   │   ├── db/            # Database models and sessions
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
│   ├── Dockerfile         # Backend Docker configuration
│   └── requirements.txt   # Python dependencies
├── frontend/               # Next.js frontend application
│   ├── src/               # Source code
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service functions
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json      # Node.js dependencies
├── infra/                 # Infrastructure configuration
│   ├── nginx/            # Nginx configuration
│   ├── docker/           # Dockerfiles for services
│   └── ci-cd/            # CI/CD pipelines
├── docs/                  # Documentation
│   ├── api.md            # API documentation
│   ├── architecture.md   # System architecture
│   ├── streaming.md      # Streaming documentation
│   └── deployment.md     # Deployment guide
├── docker-compose.yml     # Docker Compose configuration
└── README.md             # This file
```

## Quick Start

### Prerequisites
- Docker and Docker Compose (recommended for local development)
- Git
- Node.js 18+ (if developing frontend locally)
- Python 3.11+ (if developing backend locally)

### Docker Compose Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gitmb56/ott-platform.git
   cd ott-platform
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Verify services are running**
   ```bash
   # Check overall health
   curl http://localhost/health
   
   # Check database connectivity
   curl http://localhost/api/v1/health/db
   
   # View metrics
   curl http://localhost/api/v1/metrics
   ```

5. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/v1
   - API Documentation: http://localhost/api/v1/docs (Swagger UI)
   - ReDoc: http://localhost/api/v1/redoc
   - Celery Monitoring: http://localhost:5555 (Flower)

### Local Development Setup (Without Docker)

#### Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env with your database credentials (PostgreSQL required)

# Initialize database
python -c "from app.db.init_db import init_db; init_db()"

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

**Frontend will be available at:** http://localhost:3000

## API Documentation

Complete API documentation is available in multiple formats:
- **Swagger UI**: `/api/v1/docs` - Interactive API explorer
- **ReDoc**: `/api/v1/redoc` - Beautiful documentation
- **Markdown**: [docs/api.md](docs/api.md) - Detailed endpoint reference

### System Endpoints
- `GET /health` - Application health status
- `GET /api/v1/health/db` - Database connection and pool health
- `GET /api/v1/metrics` - Connection pool and performance metrics

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication (returns JWT + refresh token)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Content Endpoints
- `GET /api/v1/videos` - List all videos (paginated)
- `GET /api/v1/videos/{video_id}` - Get video details
- `POST /api/v1/videos` - Upload new video (requires authentication)
- `GET /api/v1/videos/{video_id}/manifest` - HLS/DASH manifest for streaming

### Subscription Endpoints
- `GET /api/v1/subscriptions` - User's active subscriptions
- `GET /api/v1/subscriptions/plans` - Available subscription plans
- `POST /api/v1/subscriptions` - Subscribe to a plan
- `DELETE /api/v1/subscriptions/{subscription_id}` - Cancel subscription

### User Endpoints
- `GET /api/v1/users/me` - Current user profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/password` - Change password

## Environment Configuration

### Backend (.env)

**Required Variables:**
```env
# Application
ENVIRONMENT=development          # Options: development, staging, production
PROJECT_NAME=OTT Platform API
SECRET_KEY=your-very-secret-key-min-32-chars-required
API_V1_STR=/api/v1

# Database
DATABASE_URL=postgresql://user:password@postgres:5432/ott_platform

# Redis
REDIS_URL=redis://redis:6379/0

# Authentication
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
JWT_ALGORITHM=HS256

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost

# Security
ALLOWED_HOSTS=localhost,127.0.0.1
PASSWORD_MIN_LENGTH=8
```

**Optional Variables:**
```env
# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment (Stripe/Razorpay)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# AWS S3 (for video storage)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=ott-videos
```

**Reference:** See [.env.example](.env.example) for complete configuration guide with descriptions.

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

### Security Best Practices
- ✅ Never commit `.env` files to version control
- ✅ Use strong SECRET_KEY (min 32 random characters)
- ✅ Rotate secrets regularly in production
- ✅ Use environment-specific configuration
- ✅ Enable HTTPS in production (handled by Nginx)
- ✅ See [SECURITY.md](SECURITY.md) for detailed security implementation

## Development

### Running Tests

```bash
# Backend unit tests
cd backend
pytest

# Backend with coverage report
pytest --cov=app --cov-report=html

# Frontend tests
cd frontend
npm test

# Integration tests
python scripts/test_api.py
npm run test:integration
```

### Code Quality & Linting

```bash
# Backend
cd backend
flake8 app/              # Linting
black app/              # Code formatting
mypy app/               # Type checking

# Frontend
cd frontend
npm run lint            # ESLint
npm run format          # Prettier formatting
```

### Database Management

```bash
# From backend directory
python -c "from app.db.init_db import init_db; init_db()"           # Initialize
python -c "from app.db.utils import DatabaseManager; DatabaseManager.vacuum_database()"  # Cleanup
python -c "from app.db.utils import DatabaseManager; DatabaseManager.health_check()"     # Health
```

### Security Testing

```bash
# Check for security vulnerabilities
cd backend
pip install bandit safety

# Run security checks
bandit -r app/
safety check

# Review security implementation
cat SECURITY.md
cat SECURITY_BEST_PRACTICES.md
```

### Development Guidelines
- Follow **PEP 8** for Python code
- Use **TypeScript** for all frontend code
- Write **unit tests** for new features
- Maintain **type safety** with type hints/annotations
- Document **API endpoints** with docstrings
- Update **documentation** when adding features
- Ensure **all tests pass** before creating PR
- Follow **SECURITY.md** practices for security-sensitive code

### Useful Development Commands

```bash
# View API documentation during development
open http://localhost:8000/docs

# Monitor Celery tasks
open http://localhost:5555  # Flower monitoring

# Check database health
curl http://localhost:8000/api/v1/health/db

# Monitor connection pool
curl http://localhost:8000/api/v1/metrics
```

## Deployment

### Production Deployment

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

#### Docker Compose (Recommended for most deployments)

1. **Prepare production environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values:
   # - ENVIRONMENT=production
   # - Strong SECRET_KEY
   # - Real DATABASE_URL
   # - Real REDIS_URL
   # - Production CORS origins
   ```

2. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

3. **Verify deployment**
   ```bash
   # Check all services running
   docker-compose ps
   
   # View logs
   docker-compose logs -f backend
   docker-compose logs -f frontend
   
   # Health check
   curl https://your-domain.com/health
   curl https://your-domain.com/api/v1/health/db
   ```

4. **Database migration (if needed)**
   ```bash
   docker-compose exec backend python -c "from app.db.init_db import init_db; init_db()"
   ```

#### SSL/TLS Certificate

The Nginx container automatically handles SSL certificate generation and renewal:
- Auto-generates certificates using Let's Encrypt
- Auto-renewal configured for certificate expiry
- HTTPS enforced in production mode
- Full TLS 1.2+ support

See [infra/nginx/README.md](infra/nginx/README.md) for SSL configuration details.

#### Production Monitoring

Access monitoring and metrics in production:
- **Health Check**: `/health` - Basic application status
- **Database Health**: `/api/v1/health/db` - Database connectivity and pool status
- **Metrics**: `/api/v1/metrics` - Connection pool and performance metrics
- **Task Monitoring**: `http://your-domain.com:5555` - Celery task dashboard (Flower)

### Performance Optimization

- **Connection Pooling**: PostgreSQL with 20 connections, 40 overflow (configured in session.py)
- **Redis Caching**: Configured for session and query result caching
- **Celery Workers**: Background task processing with auto-scaling
- **Nginx**: Gzip compression, rate limiting, caching headers
- **Database**: Automated VACUUM and ANALYZE for query performance

### High Availability Setup

For high availability deployments:
- Run multiple backend instances behind Nginx load balancer
- Use managed PostgreSQL service (AWS RDS, Azure Database, etc.)
- Use managed Redis service (AWS ElastiCache, Redis Cloud, etc.)
- Configure health check endpoints for load balancer
- Enable connection pooling per instance
- Use database replication for disaster recovery

## Security

This platform implements enterprise-grade security practices:

### Authentication & Authorization
- ✅ **JWT Tokens**: Secure token-based authentication with refresh mechanism
- ✅ **Password Security**: BCrypt hashing with 12 rounds (>100ms per hash)
- ✅ **Password Validation**: Minimum 8 characters, requires uppercase, lowercase, numbers, special chars
- ✅ **Token Management**: Token type validation, expiration checking, JTI-based revocation
- ✅ **Session Management**: Secure session tokens with configurable expiration

### Data Protection
- ✅ **HTTPS/TLS**: Enforced in production (TLS 1.2+)
- ✅ **Database**: PostgreSQL connection pooling with pre-ping health checks
- ✅ **Input Validation**: Pydantic v2 schema validation on all requests
- ✅ **XSS Prevention**: HTML sanitization and content security headers
- ✅ **SQL Injection**: Parameterized queries through SQLAlchemy ORM
- ✅ **CSRF Protection**: SameSite cookies and origin validation

### Network Security
- ✅ **CORS**: Whitelist-based origin validation (no wildcard)
- ✅ **Rate Limiting**: 3 zones with configurable thresholds
- ✅ **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, etc.
- ✅ **Trusted Host**: Host header validation to prevent spoofing
- ✅ **HTTPS Redirect**: Automatic redirect from HTTP to HTTPS

### Infrastructure Security
- ✅ **Container Security**: Docker with minimal base images
- ✅ **Network Isolation**: Services communicate via internal Docker networks
- ✅ **Secrets Management**: Environment variables for all sensitive data
- ✅ **.gitignore**: Comprehensive rules prevent secret commits
- ✅ **Health Monitoring**: Continuous connection and service health checks

### Security Documentation
- **[SECURITY.md](SECURITY.md)** - Complete implementation details of all security measures
- **[SECURITY_BEST_PRACTICES.md](SECURITY_BEST_PRACTICES.md)** - Developer guidelines for secure coding
- **[SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md)** - Audit summary and improvements made

### Reporting Security Issues

⚠️ **Do NOT create public GitHub issues for security vulnerabilities.**

Please email security concerns to: security@ott-platform.com

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** following development guidelines
4. **Write/update tests** for your changes
5. **Ensure all tests pass**
   ```bash
   cd backend && pytest
   cd ../frontend && npm test
   ```
6. **Update documentation** as needed
7. **Commit with clear messages**
   ```bash
   git commit -m 'feat: add amazing feature'
   git commit -m 'fix: resolve issue #123'
   git commit -m 'docs: update README'
   ```
8. **Push to your fork** and **create a Pull Request**

### Contribution Guidelines

#### Code Standards
- Follow **PEP 8** for Python (use `black` and `flake8`)
- Use **TypeScript** for all frontend code
- Run **type checking** (`mypy` for Python, TypeScript compiler for frontend)
- Maintain **>80% test coverage** for new code
- Write **clear, descriptive commit messages** (use conventional commits)

#### Pull Request Process
1. Update documentation for any new features
2. Ensure all tests pass (`pytest` for backend, `npm test` for frontend)
3. Run security checks (`bandit`, `safety` for Python)
4. Request review from maintainers
5. Address review feedback promptly

#### Issue Reporting
- Use GitHub issues for bugs and feature requests
- Include reproduction steps for bugs
- Provide environment details (OS, Python version, etc.)
- For security issues, see Security section above

### Project Structure Best Practices
- **Backend**: Service layer abstraction, proper error handling, comprehensive logging
- **Frontend**: Component composition, type safety, responsive design
- **Database**: Migration-safe schema changes, proper constraints, audit trails
- **Infrastructure**: Infrastructure as code, environment-based configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Community

### Getting Help
- 📖 **Documentation**: Check [docs/](docs/) folder for detailed guides
- 🔒 **Security Issues**: Email security@ott-platform.com (do NOT use GitHub issues)
- 🐛 **Bug Reports**: Create issue with reproducible steps
- 💭 **Feature Requests**: Open issue with description and use case
- 💬 **Discussions**: Use GitHub Discussions for general questions

### Additional Resources
- [API Documentation](docs/api.md)
- [Architecture Overview](docs/architecture.md)
- [Streaming Guide](docs/streaming.md)
- [Deployment Guide](docs/deployment.md)
- [Testing Guide](docs/testing.md)
- [Security Implementation](SECURITY.md)
- [Security Best Practices](SECURITY_BEST_PRACTICES.md)

## Roadmap

### Completed ✅
- [x] Production-grade security hardening
- [x] Database connection pooling and optimization
- [x] Health monitoring endpoints
- [x] Comprehensive API documentation
- [x] Docker Compose infrastructure setup
- [x] Nginx reverse proxy with SSL/TLS

### In Progress 🔄
- [ ] Advanced video streaming with adaptive bitrate
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Celery background task implementation
- [ ] Analytics and recommendation engine
- [ ] Admin dashboard

### Planned 📋
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Social features (comments, ratings, sharing)
- [ ] Offline viewing capabilities
- [ ] CDN integration for video distribution
- [ ] Live streaming support
- [ ] DRM/Content protection

### Future Enhancements 🚀
- Cloud deployment templates (AWS, Azure, GCP)
- Kubernetes deployment manifests
- Machine learning-based recommendations
- Advanced caching strategies
- Real-time notifications
- API rate limiting per user tier

---

## Statistics

- **Backend**: ~2000 lines of production code
- **Frontend**: ~1500 lines of TypeScript/React code
- **Infrastructure**: Docker Compose with 8 services
- **Security**: 12+ security implementations
- **Documentation**: 5+ comprehensive guides
- **Test Coverage**: Database and API coverage included

---

<div align="center">

**Built with ❤️ for modern video streaming experiences**

[Star us on GitHub](https://github.com/Gitmb56/ott-platform) ⭐ | [Report an Issue](https://github.com/Gitmb56/ott-platform/issues) 🐛 | [Contribute](CONTRIBUTING.md) 🤝

</div>