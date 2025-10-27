# Docker Development Guide

Complete guide for using Docker with the Votely project.

## 🐳 Overview

The Votely project uses Docker to provide a consistent development environment across different machines. The Docker setup includes:

- **PostgreSQL Database**: Persistent data storage
- **NestJS Backend**: API server with hot-reload
- **Automated Seeding**: Database initialization
- **Volume Persistence**: Data survives container restarts

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### Verify Installation

```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

Navigate to the backend directory and start everything:

```bash
cd backend
yarn docker:dev
```

This single command will:
1. Build the backend Docker image
2. Start PostgreSQL container
3. Start backend container
4. Wait for database to be ready
5. Seed the database with initial data

## 📦 Docker Services

### PostgreSQL Database

**Container Name**: `votely-postgres`
**Image**: `postgres:15-alpine`
**Ports**: `5432:5432`

**Configuration**:
- Database: `votely_dev`
- Username: `postgres` 
- Password: `postgres`
- Volume: `postgres_data` (persistent)

**Health Check**: Ensures database is ready before starting backend

### NestJS Backend

**Container Name**: `votely-backend`
**Image**: `backend-backend:latest` (built from Dockerfile.dev)
**Ports**: `3000:3000`

**Features**:
- TypeScript compilation with ts-node
- Hot-reload development (file watching)
- Automatic restart on changes
- Volume mounts for live code updates

## 🛠️ Available Commands

### Development Commands

```bash
# Start full development environment
yarn docker:dev

# Start services in background
yarn docker:up

# Build Docker images
yarn docker:build

# Stop all services
yarn docker:down

# View logs from all services
yarn docker:logs

# View logs from specific service
docker-compose logs backend
docker-compose logs postgres
```

### Database Commands

```bash
# Seed database with initial data
yarn docker:seed

# Connect to database
docker exec -it votely-postgres psql -U postgres -d votely_dev

# Backup database
docker exec votely-postgres pg_dump -U postgres votely_dev > backup.sql

# Restore database
docker exec -i votely-postgres psql -U postgres votely_dev < backup.sql
```

### Container Management

```bash
# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Stop and remove containers + volumes (clean slate)
docker-compose down -v

# View container resource usage
docker stats

# Execute command in running container
docker exec -it votely-backend /bin/sh
```

## 📁 Docker Configuration Files

### docker-compose.yml

Main orchestration file that defines:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: votely_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: votely_dev
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
```

### Dockerfile.dev

Development Docker image configuration:

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Setup Yarn Berry
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copy dependency files
COPY .yarnrc.docker.yml .yarnrc.yml
COPY package.json yarn.lock ./
COPY .yarn .yarn

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/main.ts"]
```

## 🔧 Development Workflow

### 1. Making Code Changes

When you modify files in the `src/` directory:
1. Changes are automatically detected (volume mount)
2. TypeScript recompiles the code
3. NestJS restarts the server
4. Changes are reflected immediately

### 2. Database Changes

**Schema Changes**:
```bash
# After modifying entities, restart backend to apply changes
docker-compose restart backend
```

**Reset Database**:
```bash
# Stop containers and remove volumes
docker-compose down -v

# Start fresh
yarn docker:dev
```

### 3. Dependency Changes

When you modify `package.json`:
```bash
# Rebuild the backend image
docker-compose build backend

# Restart with new dependencies
docker-compose up backend
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5432

# Change ports in docker-compose.yml if needed
```

**Database Connection Failed**:
```bash
# Check if PostgreSQL is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Ensure backend waits for database
# (health check should handle this)
```

**Container Keeps Restarting**:
```bash
# Check backend logs
docker-compose logs backend

# Common causes:
# - Yarn Berry/PnP issues (handled by node-modules linker)
# - Missing environment variables
# - Database not ready (health check issue)
```

**Out of Disk Space**:
```bash
# Clean up Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune

# Check Docker disk usage
docker system df
```

### Debugging Commands

**Inspect Container**:
```bash
# Get shell access to backend container
docker exec -it votely-backend /bin/sh

# Check environment variables
docker exec votely-backend env

# Check process list
docker exec votely-backend ps aux
```

**Network Issues**:
```bash
# Check Docker networks
docker network ls

# Inspect the project network
docker network inspect backend_default

# Test connectivity between containers
docker exec votely-backend ping postgres
```

## 🏗️ Advanced Configuration

### Custom Environment Variables

Create a `.env.docker` file for Docker-specific overrides:

```env
# .env.docker
DATABASE_HOST=postgres
DATABASE_PORT=5432
JWT_SECRET=docker_development_secret
NODE_ENV=development
```

Update docker-compose.yml:
```yaml
backend:
  env_file:
    - .env.docker
```

### Development vs Production

**Development** (current setup):
- Volume mounts for hot-reload
- Development dependencies included
- Debug logging enabled
- Source maps available

**Production** (future):
- Built application (no source files)
- Optimized image size
- Production dependencies only
- Environment-specific configuration

### Volume Mounts Explained

```yaml
volumes:
  - .:/app                    # Mount source code for hot-reload
  - /app/node_modules        # Prevent overwriting node_modules
```

This setup:
- Syncs your local code changes to the container
- Preserves the container's node_modules (Yarn Berry compatibility)
- Enables real-time development

## 🚀 Performance Tips

1. **Use Docker BuildKit**:
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Prune Regularly**:
   ```bash
   docker system prune -f
   ```

3. **Monitor Resources**:
   ```bash
   docker stats
   ```

4. **Optimize Images**:
   - Use multi-stage builds for production
   - Leverage Docker layer caching
   - Use .dockerignore effectively

## 📚 Next Steps

- **Local Development**: [Development Setup Guide](./development-setup.md)
- **API Testing**: [API Reference](./api-reference.md)
- **Contributing**: [Contributing Guidelines](./contributing.md)
- **Backend Details**: [Backend Documentation](../backend/README.md)