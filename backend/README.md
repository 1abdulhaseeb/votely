# Votely Backend API

A robust NestJS backend API for the Votely voting application, featuring user authentication, role-based access control, and a PostgreSQL database with Docker support.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with TypeORM for robust data management
- **User Management**: Complete user registration, login, and profile management
- **Role System**: Admin and user roles with appropriate permissions
- **Docker Support**: Fully containerized development environment
- **Database Seeding**: Automated admin user and role creation
- **Type Safety**: Full TypeScript support with strict type checking

## 🛠️ Tech Stack

- **Framework**: NestJS v11
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator & class-transformer
- **Package Manager**: Yarn Berry (v4.9.2)
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Yarn (will be installed via Corepack)

## 🚀 Quick Start

### Option 1: Docker Development (Recommended)

1. **Clone and navigate to the backend directory:**
   ```bash
   git clone <repository-url>
   cd votely/backend
   ```

2. **Start the development environment:**
   ```bash
   yarn docker:dev
   ```

   This will:
   - Build and start PostgreSQL container
   - Build and start the NestJS backend container
   - Automatically seed the database with admin user and roles

3. **Access the application:**
   - API: `http://localhost:3000`
   - Database: `localhost:5432`

4. **Seed the database (if needed):**
   ```bash
   yarn seed
   ```

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. **Start PostgreSQL (using Docker):**
   ```bash
   docker-compose up postgres -d
   ```

4. **Run database migrations and seed:**
   ```bash
   yarn seed
   ```

5. **Start the development server:**
   ```bash
   yarn start:dev
   ```

## 🔧 Available Scripts

### Development
```bash
yarn start:dev          # Start in watch mode
yarn start:debug        # Start in debug mode
yarn build              # Build for production
yarn start:prod         # Start production build
```

### Docker Commands
```bash
yarn docker:dev         # Start development environment
yarn docker:build       # Build Docker images
yarn docker:up          # Start containers
yarn docker:down        # Stop containers
yarn docker:logs        # View container logs
yarn docker:seed        # Run database seeding in Docker
```

### Database
```bash
yarn seed              # Seed database with initial data
```

### Testing
```bash
yarn test              # Run unit tests
yarn test:watch        # Run tests in watch mode
yarn test:cov          # Run tests with coverage
yarn test:e2e          # Run end-to-end tests
```

### Code Quality
```bash
yarn lint              # Lint code
yarn format            # Format code with Prettier
```

## 📡 API Endpoints

### Authentication
- `GET /` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires JWT)

### Example Requests

#### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

#### Get Profile (requires JWT token)
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🗄️ Database

### Default Admin User
The database is automatically seeded with an admin user:
- **Email**: `admin@example.com`
- **Password**: `Admin123!`
- **Username**: `admin`

### Database Schema

#### Users Table
- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password (bcrypt)
- `firstName` - User's first name (optional)
- `lastName` - User's last name (optional)
- `isActive` - Account status (default: true)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### Roles Table
- `id` - Primary key
- `name` - Role name (admin, user)
- `description` - Role description

### Database Connection
- **Host**: localhost (or `postgres` in Docker)
- **Port**: 5432
- **Database**: votely_dev
- **Username**: postgres
- **Password**: postgres

## 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=votely_dev

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
JWT_EXPIRES_IN=3600s
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── strategies/       # JWT & Local strategies
│   ├── users/                # Users module
│   │   ├── user.entity.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── roles/                # Roles module
│   │   ├── role.entity.ts
│   │   ├── roles.service.ts
│   │   └── roles.module.ts
│   ├── app.module.ts         # Main application module
│   ├── main.ts              # Application entry point
│   └── seed.ts              # Database seeding script
├── docker-compose.yml        # Docker services configuration
├── Dockerfile.dev           # Development Docker image
├── .env                     # Environment variables
└── package.json             # Dependencies and scripts
```

## 🧪 Testing

The application includes comprehensive testing setup:

### Unit Tests
```bash
yarn test              # Run all unit tests
yarn test:watch        # Run tests in watch mode
yarn test:cov          # Generate coverage report
```

### End-to-End Tests
```bash
yarn test:e2e          # Run e2e tests
```

### Test Structure
- **Unit tests**: Located alongside source files (`.spec.ts`)
- **E2E tests**: Located in `/test` directory
- **Test configuration**: `jest` configuration in `package.json`

## 🚀 Deployment

### Production Build
```bash
yarn build
yarn start:prod
```

### Docker Production
```bash
docker build -f Dockerfile.prod -t votely-backend:prod .
docker run -p 3000:3000 votely-backend:prod
```

## 🛠️ Development

### Adding New Features
1. Create feature modules in `/src`
2. Add entities with TypeORM decorators
3. Implement services for business logic
4. Create controllers for API endpoints
5. Add authentication guards where needed
6. Write tests for new functionality

### Code Style
- Use TypeScript with strict mode
- Follow NestJS conventions
- Use ESLint + Prettier for formatting
- Write comprehensive tests
- Document API endpoints

## 🔧 Troubleshooting

### Common Issues

**Docker container keeps restarting:**
- Check logs: `yarn docker:logs`
- Ensure PostgreSQL is healthy before backend starts
- Verify environment variables

**Database connection failed:**
- Ensure PostgreSQL container is running
- Check database credentials in `.env`
- Verify network connectivity between containers

**Yarn Berry/PnP issues:**
- The Docker setup uses `node-modules` linker for compatibility
- Local development uses PnP mode
- Clear cache: `yarn cache clean`

### Useful Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Connect to database
docker exec -it votely-postgres psql -U postgres -d votely_dev

# Restart services
docker-compose restart backend
```

## 📚 Resources

### NestJS Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT Authentication Guide](https://docs.nestjs.com/security/authentication)

### Votely Project
- [Main Repository](../README.md)
- [Project Documentation](../docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `yarn test`
5. Lint your code: `yarn lint`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

For questions and support regarding the Votely backend:
- Create an issue in the main repository
- Check the troubleshooting section above
- Review the NestJS documentation for framework-specific questions
