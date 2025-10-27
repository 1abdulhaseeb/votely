# Votely Documentation

Welcome to the Votely project documentation. This directory contains comprehensive guides and references for the Votely voting application.

## 📚 Documentation Index

### Getting Started
- [Quick Start Guide](./quick-start.md) - Get up and running quickly
- [Development Setup](./development-setup.md) - Detailed development environment setup
- [Docker Guide](./docker-guide.md) - Complete Docker development workflow

### API Documentation
- [API Reference](./api-reference.md) - Complete API endpoint documentation
- [Authentication Guide](./authentication.md) - JWT authentication implementation
- [Database Schema](./database-schema.md) - Database structure and relationships

### Development
- [Contributing Guidelines](./contributing.md) - How to contribute to the project
- [Code Style Guide](./code-style.md) - Coding standards and conventions
- [Testing Strategy](./testing.md) - Testing approach and guidelines

### Deployment
- [Production Deployment](./deployment.md) - Production deployment guide
- [Environment Configuration](./environment.md) - Environment variables and configuration

## 🏗️ Architecture Overview

Votely is built with a modern, scalable architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Future)      │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current Components

#### Backend (NestJS)
- **Location**: `/backend`
- **Technology**: NestJS v11, TypeScript, TypeORM
- **Features**: JWT Authentication, Role-based access, RESTful API
- **Documentation**: [Backend README](../backend/README.md)

#### Database (PostgreSQL)
- **Technology**: PostgreSQL 15
- **ORM**: TypeORM with migrations
- **Features**: User management, role system, automated seeding

### Planned Components

#### Frontend
- **Technology**: TBD (React, Vue, or Angular)
- **Features**: Voting interface, user dashboard, admin panel

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd votely
   ```

2. **Start the backend:**
   ```bash
   cd backend
   yarn docker:dev
   ```

3. **Access the API:**
   - API: http://localhost:3000
   - Database: localhost:5432

4. **Test with the default admin user:**
   - Email: `admin@example.com`
   - Password: `Admin123!`

## 📋 Project Status

### ✅ Completed Features
- User authentication (registration, login)
- JWT token-based authorization
- Role-based access control (admin/user)
- PostgreSQL database with TypeORM
- Docker development environment
- Database seeding
- Comprehensive API documentation

### 🔄 In Progress
- Enhanced user profile management
- Advanced role permissions
- API rate limiting
- Comprehensive testing suite

### 📋 Planned Features
- Frontend application
- Voting functionality
- Real-time updates
- Advanced admin dashboard
- Email notifications
- API versioning

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./contributing.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Coding standards

## 📞 Support

- **Issues**: Create an issue in the main repository
- **Documentation**: Check the relevant guide in this directory
- **Development**: Review the backend documentation for technical details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.