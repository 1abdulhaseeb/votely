# Votely

A modern voting application built with a scalable architecture, featuring robust authentication, role-based access control, and a fully containerized development environment.

## 🚀 Quick Start

Get up and running in under 5 minutes:

```bash
git clone <repository-url>
cd votely/backend
yarn docker:dev
```

Then visit `http://localhost:3000` and login with:
- **Email**: `admin@example.com`
- **Password**: `Admin123!`

📖 **[Complete Quick Start Guide →](./docs/quick-start.md)**

## 📚 Documentation

- **[📖 Complete Documentation](./docs/README.md)** - Comprehensive project documentation
- **[🚀 Quick Start Guide](./docs/quick-start.md)** - Get running in 5 minutes
- **[📡 API Reference](./docs/api-reference.md)** - Complete API documentation
- **[🐳 Docker Guide](./docs/docker-guide.md)** - Docker development workflow
- **[⚙️ Environment Configuration](./docs/environment.md)** - Environment variables and setup
- **[💻 Backend Documentation](./backend/README.md)** - Detailed backend setup and features

## 🏗️ Project Structure

This is a monorepo containing the following components:

```
votely/
├── backend/          # NestJS REST API server
├── docs/            # Project documentation
├── LICENSE          # MIT License
└── README.md        # This file
```

## ✨ Current Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt

### 🗄️ Database & ORM
- PostgreSQL 15 database
- TypeORM with entity relationships
- Automated database seeding
- Migration support

### 🐳 Development Environment
- Fully containerized with Docker
- Docker Compose orchestration
- Hot-reload development setup
- Automated database setup

### 📡 API Features
- RESTful API design
- Comprehensive validation
- Error handling and logging
- TypeScript throughout

## 🛠️ Backend (NestJS API)

The backend is a robust NestJS application with comprehensive features:

### 🔧 Technologies Used

- **Framework**: NestJS v11 with TypeScript
- **Database**: PostgreSQL 15 with TypeORM
- **Authentication**: JWT tokens with Passport.js
- **Password Security**: bcryptjs hashing
- **Validation**: class-validator & class-transformer
- **Package Manager**: Yarn Berry (v4.9.2)
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest with e2e testing support

### 📋 Available Scripts

```bash
# Docker Development (Recommended)
yarn docker:dev         # Start full environment
yarn docker:build       # Build containers
yarn docker:down        # Stop containers
yarn docker:logs        # View logs
yarn docker:seed        # Seed database

# Local Development
yarn install            # Install dependencies
yarn start:dev          # Start in watch mode
yarn build              # Build for production
yarn test               # Run tests
yarn lint               # Lint code
```

### 🗄️ Database Access

- **URL**: `localhost:5432`
- **Database**: `votely_dev`
- **Username**: `postgres`
- **Password**: `postgres`
- **Admin User**: `admin@example.com` / `Admin123!`

## 🚦 API Endpoints

### Authentication
- `GET /` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - User profile (protected)

📖 **[Complete API Documentation →](./docs/api-reference.md)**

## 🎯 Development Workflow

### For Backend Development

1. **Start the development environment:**
   ```bash
   cd backend
   yarn docker:dev
   ```

2. **Make your changes** to the source code

3. **Test your changes:**
   ```bash
   yarn test
   yarn test:e2e
   ```

4. **Check code quality:**
   ```bash
   yarn lint
   ```

### For Documentation Updates

1. Edit files in the `docs/` directory
2. Update the main README if needed
3. Ensure all links work correctly

📖 **[Complete Development Guide →](./docs/development-setup.md)**

## 🐳 Docker Development

The project includes a complete Docker development environment:

```bash
# Start everything (recommended)
cd backend && yarn docker:dev

# Individual commands
yarn docker:build       # Build images
yarn docker:up          # Start containers
yarn docker:down        # Stop containers
yarn docker:logs        # View logs
```

**What gets started:**
- PostgreSQL database (port 5432)
- NestJS backend (port 3000)
- Automatic database seeding
- Hot-reload development

📖 **[Complete Docker Guide →](./docs/docker-guide.md)**

## 📋 Project Status

### ✅ Completed Features
- ✅ User authentication (registration, login, JWT)
- ✅ Role-based access control (admin/user roles)
- ✅ PostgreSQL database with TypeORM
- ✅ Docker development environment
- ✅ Database seeding with default admin user
- ✅ Comprehensive API documentation
- ✅ Input validation and error handling
- ✅ Password hashing and security

### 🔄 In Progress
- 🔄 Enhanced user profile management
- 🔄 Advanced role permissions system
- 🔄 API rate limiting
- 🔄 Comprehensive testing suite

### 📋 Planned Features
- 📋 Frontend application (React/Vue/Angular)
- 📋 Voting and polling functionality
- 📋 Real-time updates with WebSockets
- 📋 Advanced admin dashboard
- 📋 Email notifications
- 📋 API versioning
- 📋 Production deployment guides

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Read the documentation**: Check out our [Contributing Guidelines](./docs/contributing.md)
4. **Make your changes** and add tests
5. **Ensure tests pass**: `yarn test` and `yarn lint`
6. **Commit your changes**: `git commit -am 'Add some feature'`
7. **Push to the branch**: `git push origin feature/your-feature-name`
8. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure Docker setup works

📖 **[Complete Contributing Guide →](./docs/contributing.md)**

## 📞 Support & Resources

### Getting Help
- 📖 **[Documentation](./docs/README.md)** - Comprehensive guides
- 🚀 **[Quick Start](./docs/quick-start.md)** - Get running fast
- 📡 **[API Reference](./docs/api-reference.md)** - Complete API docs
- 🐳 **[Docker Guide](./docs/docker-guide.md)** - Containerization help
- 💻 **[Backend Docs](./backend/README.md)** - Detailed backend info

### External Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Reporting Issues
- Create an issue in this repository
- Provide detailed reproduction steps
- Include system information and logs
- Check existing issues first

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
