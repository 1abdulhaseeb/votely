# Quick Start Guide

Get the Votely backend up and running in under 5 minutes!

## 🚀 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Git](https://git-scm.com/) for cloning the repository

## 📥 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd votely/backend
```

### 2. Start the Development Environment

```bash
# This single command will:
# - Start PostgreSQL database
# - Build and start the NestJS backend
# - Seed the database with initial data
yarn docker:dev
```

Wait for the containers to start (about 30-60 seconds).

### 3. Verify Installation

**Check if services are running:**
```bash
docker-compose ps
```

You should see both `votely-backend` and `votely-postgres` containers running.

**Test the API:**
```bash
curl http://localhost:3000
```

Expected response: `Hello World!`

## 🔐 Default Login

The system comes with a pre-configured admin user:

- **Email**: `admin@example.com`
- **Password**: `Admin123!`

## 🧪 Test the Authentication

### 1. Login to get a JWT token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin"
  }
}
```

### 2. Access protected route:

Copy the `access_token` from the previous response and use it:

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 🎯 What's Next?

Now that your backend is running, you can:

1. **Explore the API**: Check out the [API Reference](./api-reference.md)
2. **Register new users**: Use the `/auth/register` endpoint
3. **Development**: Read the [Development Setup](./development-setup.md) guide
4. **Database**: Explore the [Database Schema](./database-schema.md)

## 🛑 Stopping the Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

## 🔧 Troubleshooting

### Container won't start?
```bash
# Check logs
docker-compose logs backend
docker-compose logs postgres

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Port already in use?
If ports 3000 or 5432 are already in use, edit `docker-compose.yml` to use different ports.

### Need to reset database?
```bash
docker-compose down -v  # Removes volumes
docker-compose up -d    # Recreates everything
```

## 📚 Additional Resources

- [Backend Documentation](../backend/README.md)
- [Docker Guide](./docker-guide.md)
- [Development Setup](./development-setup.md)