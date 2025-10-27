# Environment Configuration

Complete guide for configuring environment variables in the Votely project.

## 📋 Overview

The Votely backend uses environment variables for configuration to ensure security and flexibility across different deployment environments.

## 🔧 Environment Files

### `.env` (Main Configuration)

Create this file in the `backend/` directory:

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

# Application Configuration
NODE_ENV=development
PORT=3000
```

### `.env.example` (Template)

Keep this in version control as a template:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=votely_dev

# JWT Configuration
JWT_SECRET=very_secret_for_dev_change_me
JWT_EXPIRES_IN=3600s
```

## 🔐 Environment Variables Reference

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` | Yes |
| `DATABASE_PORT` | PostgreSQL port | `5432` | Yes |
| `DATABASE_USER` | Database username | `postgres` | Yes |
| `DATABASE_PASSWORD` | Database password | `postgres` | Yes |
| `DATABASE_NAME` | Database name | `votely_dev` | Yes |

### JWT Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | `3600s` | No |

**JWT_SECRET Security**:
- Use a strong, random string (min 32 characters)
- Never commit production secrets to version control
- Change for each environment (dev, staging, prod)

**JWT_EXPIRES_IN Format**:
- `3600s` - 3600 seconds (1 hour)
- `24h` - 24 hours
- `7d` - 7 days
- `30m` - 30 minutes

### Application Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Application port | `3000` | No |

## 🌍 Environment-Specific Configuration

### Development Environment

```env
# .env (development)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=votely_dev
JWT_SECRET=dev_secret_key_change_me
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=3000
```

### Docker Environment

For Docker development, certain variables are automatically set:

```env
# Automatically set by docker-compose.yml
DATABASE_HOST=postgres  # Container name
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=votely_dev
```

### Production Environment

```env
# .env.production (example)
DATABASE_HOST=prod-postgres-server.com
DATABASE_PORT=5432
DATABASE_USER=votely_prod_user
DATABASE_PASSWORD=ultra_secure_production_password
DATABASE_NAME=votely_production
JWT_SECRET=ultra_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=1h
NODE_ENV=production
PORT=3000
```

## 🔒 Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```gitignore
# Environment files
.env
.env.local
.env.production
.env.staging

# Backup files
.env.backup
```

### 2. Use Strong JWT Secrets

Generate secure JWT secrets:

```bash
# Generate random string (macOS/Linux)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Environment Validation

The application validates required environment variables on startup. Missing variables will cause the app to fail to start with clear error messages.

### 4. Separate Secrets by Environment

- **Development**: Use simple, non-secret values
- **Staging**: Use staging-specific secrets
- **Production**: Use highly secure, unique secrets

## 🛠️ Configuration Loading

### How It Works

1. **NestJS ConfigModule** loads environment variables
2. **Global configuration** makes variables available app-wide
3. **Type safety** through configuration interfaces
4. **Validation** ensures required variables are present

### Configuration Service

```typescript
// src/config/configuration.ts
export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
});
```

## 🐳 Docker Configuration

### docker-compose.yml Environment

```yaml
services:
  backend:
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: votely_dev
      JWT_SECRET: ${JWT_SECRET:-dev_secret}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-3600s}
```

### Using .env with Docker

Docker Compose automatically loads `.env` files:

```bash
# .env file is automatically loaded
docker-compose up

# Override with specific env file
docker-compose --env-file .env.docker up
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**:
```
Error: getaddrinfo ENOTFOUND localhost
```
- Check `DATABASE_HOST` value
- Ensure PostgreSQL is running
- Verify port availability

**JWT Token Invalid**:
```
Error: JsonWebTokenError: invalid signature
```
- Check `JWT_SECRET` consistency
- Ensure secret hasn't changed between requests
- Verify secret length (minimum recommended)

**Environment Variable Not Found**:
```
Error: Configuration validation failed
```
- Check variable name spelling
- Ensure `.env` file exists
- Verify file is in correct directory

### Debugging Commands

**Check Environment Variables**:
```bash
# In Docker container
docker exec votely-backend env | grep DATABASE

# In local development
node -e "console.log(process.env.DATABASE_HOST)"
```

**Validate Configuration**:
```bash
# Start app and check logs for configuration errors
yarn start:dev

# Check if .env file is loaded
ls -la .env
```

## 📚 Additional Resources

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🔗 Related Documentation

- [Quick Start Guide](./quick-start.md)
- [Docker Guide](./docker-guide.md)
- [Backend Documentation](../backend/README.md)
- [API Reference](./api-reference.md)