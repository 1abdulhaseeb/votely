# Docker Setup

> **📖 For comprehensive Docker documentation, see the [Docker Guide](../docs/docker-guide.md)**

Quick reference for running the Votely backend using Docker.

## 🚀 Quick Start

```bash
# Start the complete development environment
yarn docker:dev
```

This will start PostgreSQL, build the backend, and seed the database automatically.

**Default admin user:**
- Email: `admin@example.com`  
- Password: `Admin123!`

**Access:**
- API: http://localhost:3000
- Database: localhost:5432

## 🔧 Common Commands

```bash
yarn docker:dev      # Start development environment
yarn docker:build    # Build Docker images  
yarn docker:up       # Start services
yarn docker:down     # Stop services
yarn docker:logs     # View logs
yarn docker:seed     # Seed database
```

## 📚 Full Documentation

For detailed information including troubleshooting, configuration, and advanced usage:

- **[Complete Docker Guide](../docs/docker-guide.md)** - Comprehensive Docker documentation
- **[Quick Start Guide](../docs/quick-start.md)** - Get running in 5 minutes
- **[Environment Configuration](../docs/environment.md)** - Environment variables setup
- **[Backend README](./README.md)** - Complete backend documentation